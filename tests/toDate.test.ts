import { describe, it, expect, beforeEach } from 'vitest'
import { Tanisa } from '../src'
import { TanisaDateOptions } from '../src/interface'

describe('toDate()', () => {
  let converter: Tanisa

  beforeEach(() => {
    converter = new Tanisa()
  })

  describe('short format (default)', () => {
    const cases: [string, string][] = [
      ['2020-01-01', '01 Janoary 2020'],
      ['2022-12-25', '25 Desambra 2022'],
      ['2001-08-05', '05 Aogositra 2001'],
      ['1990-03-20', '20 Martsa 1990'],
      ['2015-11-30', '30 Novambra 2015'],
      ['2010-02-14', '14 Febroary 2010'],
      ['2005-04-09', '09 Aprily 2005'],
      ['2008-05-01', '01 Mey 2008'],
      ['2000-06-10', '10 Jona 2000'],
      ['1999-07-21', '21 Jolay 1999'],
      ['1985-09-03', '03 Septambra 1985'],
      ['2023-10-31', '31 Oktobra 2023'],
    ]

    it.each(cases)('converts "%s" to "%s"', (input, expected) => {
      expect(converter.toDate(input)).toBe(expected)
    })

    it('uses short format when format option is explicitly "short"', () => {
      const options: TanisaDateOptions = { format: 'short' }
      expect(converter.toDate('2020-01-01', options)).toBe('01 Janoary 2020')
    })
  })

  describe('long format (words)', () => {
    const cases: [string, string][] = [
      // day 1: special word
      ['2020-01-01', "voalohan'ny volana Janoary, taona roapolo sy roa arivo"],
      // regular days and years
      [
        '2022-12-25',
        'dimy amby roapolo Desambra, taona roa amby roapolo sy roa arivo',
      ],
      [
        '1994-07-04',
        'efatra Jolay, taona efatra amby sivifolo sy sivinjato sy arivo',
      ],
      ['2000-06-10', 'folo Jona, taona roa arivo'],
      ['1990-03-20', 'roapolo Martsa, taona sivifolo sy sivinjato sy arivo'],
    ]

    it.each(cases)('converts "%s" to "%s"', (input, expected) => {
      const options: TanisaDateOptions = { format: 'long' }
      expect(converter.toDate(input, options)).toBe(expected)
    })
  })

  describe('input types', () => {
    it('accepts a Date object', () => {
      const date = new Date(2022, 11, 25) // Dec 25, 2022 in local time
      expect(converter.toDate(date)).toBe('25 Desambra 2022')
    })

    it('accepts a Unix timestamp (ms)', () => {
      const timestamp = new Date(2022, 11, 25).getTime()
      expect(converter.toDate(timestamp)).toBe('25 Desambra 2022')
    })

    it('accepts an ISO datetime string and uses its date part', () => {
      expect(converter.toDate('2020-01-15T10:30:00Z')).toBe('15 Janoary 2020')
    })
  })

  describe('error handling', () => {
    it('throws TypeError for an unparseable string', () => {
      expect(() => converter.toDate('not a date')).toThrow(TypeError)
    })

    it('throws TypeError for an invalid Date object', () => {
      expect(() => converter.toDate(new Date('invalid'))).toThrow(TypeError)
    })

    it('throws TypeError for out-of-range month in ISO string', () => {
      expect(() => converter.toDate('2024-13-01')).toThrow(TypeError)
      expect(() => converter.toDate('2024-00-15')).toThrow(TypeError)
    })

    it('throws TypeError for out-of-range day in ISO string', () => {
      expect(() => converter.toDate('2024-01-00')).toThrow(TypeError)
      expect(() => converter.toDate('2024-01-99')).toThrow(TypeError)
    })
  })
})
