# tanisa

[![npm version](https://badge.fury.io/js/tanisa.svg)](https://www.npmjs.com/package/tanisa)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

**Tanisa** is here to give those digits a voice, transforming them into elegant Malagasy words 🇲🇬.

**In simpler terms** : A utility to convert Malagasy numbers, dates, and times into their word representations.

## Features

- ✅ **Handles whole numbers** : From a humble "aotra" (zero) to numbers that make your calculator sweat.
- ✅ **Decimal support** : Gracefully converts those pesky fractions into spoken form.
- ✅ **Large number linguistics**: Tackles big numbers with the appropriate Malagasy terminology.
- ✅ **Date formatting** : Converts dates to Malagasy short or long spoken form.
- ✅ **Time formatting** : Converts times to Malagasy spoken time with the correct time-of-day period.
- ✅ **User-friendly API** : So intuitive, you'll feel like you've been speaking number-words your whole life.
- ✅ **Configurable options** : Customize conversion behaviour for decimals, date format, and time precision.
- 🛡️ **Error Handling** : Throws helpful errors when you try to feed it something it can't digest.

## Installation

```bash
yarn add tanisa
# or
npm install tanisa
```

## Usage

```ts
import { Tanisa } from 'tanisa'

const tanisa = new Tanisa()
```

---

## `.toWords(input, options?)`

Converts a number (or numeric string) to its Malagasy word representation.

```ts
tanisa.toWords(233) // "telo amby telopolo sy roanjato"
tanisa.toWords(18.3) // "valo ambin'ny folo faingo telo"
tanisa.toWords(0.008) // "aotra faingo aotra aotra valo"
tanisa.toWords(12_345_678_901)
// "iraika amby sivinjato sy valo arivo sy fito alina sy enina hetsy sy dimy tapitrisa
//  sy efatra safatsiroa sy telo tsitamboisa sy roa lavitrisa sy iray alinkisa"
```

### Options

| Option          | Type      | Default           | Description                                                                                                 |
| :-------------- | :-------- | :---------------- | :---------------------------------------------------------------------------------------------------------- |
| `ignoreDecimal` | `boolean` | `false`           | Ignore all digits after the decimal point.                                                                  |
| `decimalPlaces` | `number`  | `undefined` (all) | Maximum decimal digits to convert. Extra digits are truncated (not rounded). Set to `0` to ignore decimals. |

> If both `ignoreDecimal: true` and `decimalPlaces` are set, `ignoreDecimal` takes precedence.

```ts
tanisa.toWords('456.789', { ignoreDecimal: true }) // "enina amby dimampolo sy efajato"
tanisa.toWords('3.14567', { decimalPlaces: 2 }) // "telo faingo efatra ambin'ny folo"
tanisa.toWords('3.14567', { decimalPlaces: 2, ignoreDecimal: true }) // "telo"
```

---

## `.toDate(input, options?)`

Converts a date to Malagasy. Accepts a date string, a `Date` object, or a Unix timestamp (ms).

### Short format (default)

```ts
tanisa.toDate('2020-01-01') // "01 Janoary 2020"
tanisa.toDate('2022-12-25') // "25 Desambra 2022"
tanisa.toDate(new Date(2022, 11, 25)) // "25 Desambra 2022"
tanisa.toDate(1640390400000) // "25 Desambra 2021" (Unix ms)
tanisa.toDate('2020-01-15T10:30:00Z') // "15 Janoary 2020"
```

### Long format

```ts
tanisa.toDate('2020-01-01', { format: 'long' })
// "voalohan'ny volana Janoary, taona roapolo sy roa arivo"

tanisa.toDate('2022-12-25', { format: 'long' })
// "dimy amby roapolo Desambra, taona roa amby roapolo sy roa arivo"

tanisa.toDate('2000-06-10', { format: 'long' })
// "folo Jona, taona roa arivo"
```

### Options

| Option   | Type                | Default   | Description                                                                                                  |
| :------- | :------------------ | :-------- | :----------------------------------------------------------------------------------------------------------- |
| `format` | `'short' \| 'long'` | `'short'` | `'short'` — zero-padded day + month name + year. `'long'` — fully spoken day, month name, and year in words. |

---

## `.toTime(input, options?)`

Converts a time to Malagasy spoken form with the correct time-of-day period. Accepts a time string (`HH:MM`, `HH:MM:SS`), an ISO datetime string, a `Date` object, or a Unix timestamp (ms).

### Time periods

| Period     | Hours                              |
| :--------- | :--------------------------------- |
| maraina    | 01:00 – 09:59                      |
| antoandro  | 10:00 – 12:59                      |
| tolakandro | 13:00 – 16:59                      |
| hariva     | 17:00 – 19:59                      |
| alina      | 20:00 – 23:59 and midnight (00:xx) |

### Examples

```ts
tanisa.toTime('01:00') // "iray ora maraina"
tanisa.toTime('10:00') // "folo ora antoandro"
tanisa.toTime('13:00') // "iray ora tolakandro"
tanisa.toTime('17:00') // "dimy ora hariva"
tanisa.toTime('20:00') // "valo ora alina"
tanisa.toTime('00:00') // "roa ambin'ny folo ora alina"  (midnight)

tanisa.toTime('09:30') // "sivy ora sy telopolo minitra maraina"
tanisa.toTime('16:45') // "efatra ora sy dimy amby efapolo minitra tolakandro"
```

### Seconds precision

```ts
tanisa.toTime('14:30:45', { precision: 'seconds' })
// "roa ora sy telopolo minitra sy dimy amby efapolo segondra tolakandro"

tanisa.toTime('14:00:30', { precision: 'seconds' })
// "roa ora sy telopolo segondra tolakandro"
```

### Accepted input types

```ts
tanisa.toTime('14:30:00') // plain HH:MM:SS string
tanisa.toTime('2020-01-15T10:00:00Z') // ISO datetime string
tanisa.toTime(new Date(2022, 0, 1, 14, 30, 0)) // Date object
tanisa.toTime(new Date(2022, 0, 1, 14, 30, 0).getTime()) // Unix timestamp (ms)
```

### Options

| Option      | Type                     | Default     | Description                                                                                            |
| :---------- | :----------------------- | :---------- | :----------------------------------------------------------------------------------------------------- |
| `precision` | `'minutes' \| 'seconds'` | `'minutes'` | Include seconds in the output when `'seconds'`. Seconds are omitted if zero even with this option set. |

---

## Error handling

All three methods throw a `TypeError` for invalid or unparseable input, and a `RangeError` for out-of-range values:

```ts
tanisa.toWords('not a number') // throws TypeError
tanisa.toWords(-5) // throws RangeError
tanisa.toDate('2024-13-01') // throws TypeError  (month 13 is invalid)
tanisa.toTime('25:00') // throws TypeError  (hour 25 is invalid)
```

---

## Contribution

**Contributions are welcome!**

Feel free to check out the [CONTRIBUTING](https://github.com/nifaliana/tanisa/blob/main/CONTRIBUTING.md) file.

## License

This project is proudly released under the [MIT License](https://github.com/nifaliana/tanisa/blob/main/LICENSE)
