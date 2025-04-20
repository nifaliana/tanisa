# tanisa

[![npm version](https://badge.fury.io/js/tanisa.svg)](https://www.npmjs.com/package/tanisa)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

**Tanisa** (Malagasy 🇲🇬 for "to count") is here to give those digits a voice, transforming them into elegant Malagasy words.

## Features

- ✅ **Handles whole numbers** : From a humble "aotra" (zero) to numbers that make your calculator sweat.
- ✅ **Decimal support** : Gracefully converts those pesky fractions into spoken form.
- ✅ **Large number linguistics**: Tackles big numbers with the appropriate Malagasy terminology.
- ✅ **User-friendly API** : So intuitive, you'll feel like you've been speaking number-words your whole life.
- 🛡️ **Error Handling** : Throws helpful errors when you try to feed it something it can't digest.

## Installation

`yarn add tanisa`

## Usage

1. Import the Magic:

```
import { Tanisa } from 'tanisa'
```

2. Simply use it:

```
const tanisa = new Tanisa();

tanisa.toWords(233)
```

3. Examples:

```
tanisa.toWords(233) ==> Telo amby telopolo sy roanjato
tanisa.toWords(18.3) ==> Valo amby folo faingo telo
tanisa.toWords(0.008) ==> Aotra faingo aotra aotra valo
```
