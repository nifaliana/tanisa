import { describe, it, expect, beforeEach } from 'vitest'
import { Tanisa } from '../src'
import { TanisaTimeOptions } from '../src/interface'

describe('toTime()', () => {
  let converter: Tanisa

  beforeEach(() => {
    converter = new Tanisa()
  })

  describe('time periods — default precision (minutes)', () => {
    const cases: [string, string][] = [
      // maraina: hours 1–9
      ['01:00', 'iray ora maraina'],
      ['09:30', 'sivy ora sy telopolo minitra maraina'],
      // antoandro: hours 10–12
      ['10:00', 'folo ora antoandro'],
      ['12:00', "roa ambin'ny folo ora antoandro"],
      // tolakandro: hours 13–16
      ['13:00', 'iray ora tolakandro'],
      ['16:45', 'efatra ora sy dimy amby efapolo minitra tolakandro'],
      // hariva: hours 17–19
      ['17:00', 'dimy ora hariva'],
      ['19:59', 'fito ora sy sivy amby dimampolo minitra hariva'],
      // alina: hours 20–23
      ['20:00', 'valo ora alina'],
      [
        '23:59',
        "iraika ambin'ny folo ora sy sivy amby dimampolo minitra alina",
      ],
    ]

    it.each(cases)('converts "%s" to "%s"', (input, expected) => {
      expect(converter.toTime(input)).toBe(expected)
    })
  })

  describe('midnight (hour 0)', () => {
    it('converts 00:00 with no minutes', () => {
      expect(converter.toTime('00:00')).toBe("roa ambin'ny folo ora alina")
    })

    it('converts 00:15 with minutes', () => {
      expect(converter.toTime('00:15')).toBe(
        "roa ambin'ny folo ora sy dimy ambin'ny folo minitra alina"
      )
    })
  })

  describe("precision: 'seconds'", () => {
    const seconds: TanisaTimeOptions = { precision: 'seconds' }

    it('includes seconds when non-zero', () => {
      expect(converter.toTime('14:30:45', seconds)).toBe(
        'roa ora sy telopolo minitra sy dimy amby efapolo segondra tolakandro'
      )
    })

    it('omits seconds when zero even with seconds precision', () => {
      expect(converter.toTime('14:30:00', seconds)).toBe(
        'roa ora sy telopolo minitra tolakandro'
      )
    })

    it('omits minutes when zero, keeps seconds', () => {
      expect(converter.toTime('14:00:30', seconds)).toBe(
        'roa ora sy telopolo segondra tolakandro'
      )
    })

    it('handles midnight with seconds only (no minutes)', () => {
      expect(converter.toTime('00:00:30', seconds)).toBe(
        "roa ambin'ny folo ora sy telopolo segondra alina"
      )
    })

    it('handles midnight with both minutes and seconds', () => {
      expect(converter.toTime('00:15:30', seconds)).toBe(
        "roa ambin'ny folo ora sy dimy ambin'ny folo minitra sy telopolo segondra alina"
      )
    })
  })

  describe("precision: 'minutes' (explicit)", () => {
    it('ignores seconds even when present in input', () => {
      const options: TanisaTimeOptions = { precision: 'minutes' }
      expect(converter.toTime('14:30:45', options)).toBe(
        'roa ora sy telopolo minitra tolakandro'
      )
    })
  })

  describe('input types', () => {
    it('accepts a plain HH:MM:SS string', () => {
      expect(converter.toTime('14:30:00')).toBe(
        'roa ora sy telopolo minitra tolakandro'
      )
    })

    it('accepts an ISO datetime string and extracts the time part', () => {
      expect(converter.toTime('2020-01-15T10:00:00Z')).toBe(
        'folo ora antoandro'
      )
    })

    it('accepts a Date object', () => {
      const date = new Date(2022, 0, 1, 14, 30, 0)
      expect(converter.toTime(date)).toBe(
        'roa ora sy telopolo minitra tolakandro'
      )
    })

    it('accepts a Unix timestamp', () => {
      const ts = new Date(2022, 0, 1, 14, 30, 0).getTime()
      expect(converter.toTime(ts)).toBe(
        'roa ora sy telopolo minitra tolakandro'
      )
    })
  })

  describe('error handling', () => {
    it('throws TypeError for an unparseable string', () => {
      expect(() => converter.toTime('not a time')).toThrow(TypeError)
    })

    it('throws TypeError for an invalid Date object', () => {
      expect(() => converter.toTime(new Date('invalid'))).toThrow(TypeError)
    })

    it('throws TypeError for negative time values', () => {
      expect(() => converter.toTime('-1:30')).toThrow(TypeError)
      expect(() => converter.toTime('08:-5:00')).toThrow(TypeError)
    })

    it('throws TypeError for time components with trailing non-digit characters', () => {
      expect(() => converter.toTime('23abc:00')).toThrow(TypeError)
      expect(() => converter.toTime('08:30xyz')).toThrow(TypeError)
    })
  })
})
