// Avisos de convocatoria a los citados que tienen cuenta en el club ("Ana te convocó a Fútbol 5").
// Sin cuenta o sin club, no hace nada: la convocatoria se manda por WhatsApp como siempre.

import { currentUserId } from './auth'
import { supabase, currentClubCode } from './sync'
import type { Id, Play } from './types'

export async function notifyCall(kind: 'call' | 'call_in', play: Play, title: string, playerIds: Id[]): Promise<void> {
  const sb = supabase()
  const code = currentClubCode()
  if (!sb || !code || !currentUserId() || !playerIds.length) return
  try {
    await sb.rpc('notify_players', {
      p_code: code,
      p_player_ids: playerIds.slice(0, 60),
      p_kind: kind,
      p_data: { play_id: play.id, title, when: play.scheduledAt ?? null, venue: play.venue ?? null },
    })
  } catch {
    // El aviso es un plus: si falla (sin conexión), la convocatoria sigue igual.
  }
}
