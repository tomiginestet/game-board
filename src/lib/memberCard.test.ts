import { describe, expect, it } from 'vitest'
import { membershipDays, membershipMedal } from './medals'
import { memberNumber, padNumber, seniorityLabel } from './memberCard'

const DAY = 86_400_000

describe('carnet de socio', () => {
  it('numera a los socios por orden de llegada', () => {
    const members = [
      { user_id: 'c', joined_at: '2026-10-03T10:00:00Z' },
      { user_id: 'a', joined_at: '2026-10-01T10:00:00Z' },
      { user_id: 'b', joined_at: '2026-10-02T10:00:00Z' },
    ]
    expect(memberNumber(members, 'a')).toBe(1)
    expect(memberNumber(members, 'c')).toBe(3)
    expect(memberNumber(members, 'z')).toBeUndefined()
    expect(padNumber(7)).toBe('007')
    expect(padNumber(1234)).toBe('1234')
  })

  it('cuenta la antigüedad en palabras', () => {
    expect(seniorityLabel(0)).toBe('Desde hoy')
    expect(seniorityLabel(1)).toBe('1 día')
    expect(seniorityLabel(20)).toBe('2 semanas')
    expect(seniorityLabel(95)).toBe('3 meses')
    expect(seniorityLabel(365)).toBe('1 año')
    expect(seniorityLabel(430)).toBe('1 año y 2 meses')
    expect(seniorityLabel(800)).toBe('2 años y 2 meses')
  })

  it('sube de nivel la medalla de socio con los días', () => {
    const now = Date.parse('2027-10-14T12:00:00Z')
    expect(membershipDays(now - 3 * DAY, now)).toBe(3)
    expect(membershipDays(now + DAY, now)).toBe(0)
    expect(membershipMedal(now, now).level).toBe(0)
    expect(membershipMedal(now - 31 * DAY, now).family.levels[membershipMedal(now - 31 * DAY, now).level].name).toBe('Cuota al día')
    expect(membershipMedal(now - 400 * DAY, now).next?.name).toBe('Socio vitalicio')
  })
})
