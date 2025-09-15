# tanisa

[![npm version](https://badge.fury.io/js/tanisa.svg)](https://www.npmjs.com/package/tanisa)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

**Tanisa** is here to give those digits a voice, transforming them into elegant Malagasy words 🇲🇬.

**In simpler terms** : An utility to convert malagasy numbers into their word representations.

## Features

- ✅ **Handles whole numbers** : From a humble "aotra" (zero) to numbers that make your calculator sweat.
- ✅ **Decimal support** : Gracefully converts those pesky fractions into spoken form.
- ✅ **Large number linguistics**: Tackles big numbers with the appropriate Malagasy terminology.
- ✅ **User-friendly API** : So intuitive, you'll feel like you've been speaking number-words your whole life.
- ✅ **Configurable options** : Customize the conversion behavior, like controlling how decimal places are handled and more...
- 🛡️ **Error Handling** : Throws helpful errors when you try to feed it something it can't digest.

## Installation

```js
yarn add tanisa
```

## Usage

1. Import the Magic:

```ts
import { Tanisa } from 'tanisa'
```

2. Simply use it:

```ts
const tanisa = new Tanisa()

tanisa.toWords(233)
```

3. Examples:

```js
tanisa.toWords(233) // Telo amby telopolo sy roanjato
tanisa.toWords(18.3) // Valo amby folo faingo telo
tanisa.toWords(0.008) // Aotra faingo aotra aotra valo

tanisa.toWords(12_345_678_901) // iraika amby sivinjato sy valo arivo sy fito alina sy enina hetsy sy dimy tapitrisa sy efatra safatsiroa sy telo tsitamboisa sy roa lavitrisa sy iray alinkisa
```

## Options

| Option Name     | Type      | Default                    | Description                                                                                                                                     |
| :-------------- | :-------- | :------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| `ignoreDecimal` | `boolean` | `false`                    | If set to `true`, the converter completely disregards any digits after the decimal point. Only the integer part of the number is considered.    |
| `decimalPlaces` | `number`  | `undefined` (converts all) | Specifies the maximum number of digits to convert in the decimal part. Extra digits are truncated (not rounded). Set to `0` to ignore decimals. |

**Note:** If both `ignoreDecimal` is `true` and `decimalPlaces` is set, `ignoreDecimal: true` takes precedence, and the decimal part will be entirely ignored.

Examples:

```js
tanisa.toWords("456.789", { ignoreDecimal: true }) // Enina amby dimampolo sy efajato

tanisa.toWords("3.14567", { decimalPlaces: 2 }); // Telo faingo efatra amby folo

tanisa.toWords("3.14567", { decimalPlaces: 2, ignoreDecimal: true }); ==>  // Telo
```

## Contribution

**Contributions are welcome!**

Feel free to check out the [CONTRIBUTING](https://github.com/nifaliana/tanisa/blob/main/CONTRIBUTING.md) file.

## License

This project is proudly released under the [MIT License](https://github.com/nifaliana/tanisa/blob/main/LICENSE)
