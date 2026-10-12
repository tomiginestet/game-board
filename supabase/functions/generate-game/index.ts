// Genera la ficha de un juego con la API de Claude.
//
// - Sólo para usuarios con sesión (verify_jwt).
// - Tope de gasto mensual para toda la app (AI_MONTHLY_LIMIT_USD, 10 por defecto) y
//   un máximo de generaciones por usuario por día (AI_DAILY_PER_USER, 10 por defecto).
// - El pedido se arma acá (no se acepta un prompt libre del cliente).
// Secretos: ANTHROPIC_API_KEY (obligatorio), AI_MODEL (opcional).

import Anthropic from 'npm:@anthropic-ai/sdk'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { MAX_RULES_CHARS, systemPrompt, userPrompt, type PromptInput } from './aiPrompt.ts'
import { EXAMPLE, SCHEMA } from './sources.ts'

const MODEL = Deno.env.get('AI_MODEL') ?? 'claude-opus-5-5'
const MONTHLY_LIMIT = Number(Deno.env.get('AI_MONTHLY_LIMIT_USD') ?? '10')
const DAILY_PER_USER = Number(Deno.env.get('AI_DAILY_PER_USER') ?? '10')

// USD por millón de tokens (entrada, salida).
const PRICES: Record<string, [number, number]> = {
  'claude-opus-5-5': [4, 20],
  'claude-sonnet-5-5': [2, 10],
  'claude-haiku-5-5': [0.1, 0.5],
}

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  if (req.method !== 'POST') return json({ error: 'Método no permitido' }, 405)

  const apiKey = Deno.env.get('ANTHROPIC_API_KEY')
  if (!apiKey) return json({ error: 'La IA automática no está disponible ahora. Probá con IA gratis: copiás las instrucciones y las pegás en cualquier chat.' }, 503)

  const url = Deno.env.get('SUPABASE_URL')!
  const admin = createClient(url, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '')
  const { data: userData } = await admin.auth.getUser(token)
  const user = userData?.user
  if (!user) return json({ error: 'Iniciá sesión para generar juegos con IA.' }, 401)

  let input: PromptInput
  try {
    const body = await req.json()
    input = {
      name: String(body?.name ?? '').slice(0, 80),
      rules: typeof body?.rules === 'string' ? body.rules.slice(0, MAX_RULES_CHARS) : undefined,
      notes: typeof body?.notes === 'string' ? body.notes.slice(0, 2000) : undefined,
    }
  } catch {
    return json({ error: 'No pudimos leer el pedido. Recargá la app y probá de nuevo.' }, 400)
  }
  if (!input.name.trim()) return json({ error: 'Falta el nombre del juego.' }, 400)

  // Topes de gasto.
  const monthStart = new Date()
  monthStart.setUTCDate(1)
  monthStart.setUTCHours(0, 0, 0, 0)
  const { data: monthRows } = await admin.from('ai_usage').select('cost_usd').gte('created_at', monthStart.toISOString())
  const spent = (monthRows ?? []).reduce((sum, r) => sum + Number(r.cost_usd), 0)
  if (spent >= MONTHLY_LIMIT) {
    return json({ error: `Se terminó el cupo de este mes para toda la app. Probá con IA gratis: copiás las instrucciones y las pegás en cualquier chat.` }, 429)
  }
  const dayAgo = new Date(Date.now() - 24 * 3600 * 1000).toISOString()
  const { count } = await admin.from('ai_usage').select('id', { count: 'exact', head: true }).eq('user_id', user.id).gte('created_at', dayAgo)
  if ((count ?? 0) >= DAILY_PER_USER) {
    return json({ error: `Ya armaste ${DAILY_PER_USER} juegos en las últimas 24 horas. Probá mañana o usá IA gratis.` }, 429)
  }

  const client = new Anthropic({ apiKey })
  try {
    const stream = client.beta.messages.stream({
      model: MODEL,
      max_tokens: 32000,
      // Esfuerzo bajo: la ficha no necesita razonamiento largo y así responde rápido.
      output_config: { effort: 'low' },
      // Si un filtro de seguridad rechaza el pedido, el servidor lo reintenta con otro modelo.
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      system: systemPrompt(SCHEMA, EXAMPLE),
      messages: [{ role: 'user', content: userPrompt(input) }],
    } as unknown as Parameters<typeof client.beta.messages.stream>[0])
    const message = await stream.finalMessage()

    const [pin, pout] = PRICES[message.model] ?? PRICES[MODEL] ?? [4, 20]
    const usage = message.usage
    const inputTokens = (usage.input_tokens ?? 0) + (usage.cache_creation_input_tokens ?? 0) + (usage.cache_read_input_tokens ?? 0)
    const cost = (inputTokens * pin + usage.output_tokens * pout) / 1_000_000
    await admin.from('ai_usage').insert({
      user_id: user.id,
      model: message.model,
      input_tokens: inputTokens,
      output_tokens: usage.output_tokens,
      cost_usd: cost,
    })

    if (message.stop_reason === 'refusal') return json({ error: 'La IA no quiso armar este juego. Probá con IA gratis.' }, 422)
    if (message.stop_reason === 'max_tokens') return json({ error: 'La respuesta quedó cortada. Probá de nuevo con reglas más cortas.' }, 422)
    const text = message.content.map((b) => (b.type === 'text' ? b.text : '')).join('')
    return json({ text, costUsd: Math.round(cost * 10000) / 10000, model: message.model })
  } catch (e) {
    if (e instanceof Anthropic.RateLimitError) return json({ error: 'La IA está con mucha demanda. Probá en un rato o usá IA gratis.' }, 429)
    if (e instanceof Anthropic.AuthenticationError) return json({ error: 'La IA automática no está disponible ahora. Probá con IA gratis.' }, 503)
    if (e instanceof Anthropic.APIError) return json({ error: 'No pudimos armar el juego. Probá de nuevo en un rato o usá IA gratis.' }, 502)
    return json({ error: 'No pudimos armar el juego. Probá de nuevo en un rato o usá IA gratis.' }, 500)
  }
})
