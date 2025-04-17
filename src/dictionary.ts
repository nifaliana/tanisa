export const MalagasyNumerals = {
  GLUE_SY: ' sy ',
  GLUE_AMBY: ' amby ',
  GLUE_FAINGO: ' faingo ',
  GLUE_DECIMAL_ZERO: 'aotra ',

  CUSTOM_ONE: 'iraika', // '1' used before 'amby'

  ZERO: 'aotra',

  // Digits 1-9
  DIGITS: [
    '',
    'iray',
    'roa',
    'telo',
    'efatra',
    'dimy',
    'enina',
    'fito',
    'valo',
    'sivy',
  ],
  // Tens 10-90
  TENS: [
    '',
    'folo',
    'roapolo',
    'telopolo',
    'efapolo',
    'dimampolo',
    'enimpolo',
    'fitopolo',
    'valopolo',
    'sivifolo',
  ],
  // Hundreds 100-900
  HUNDREDS: [
    '',
    'zato',
    'roanjato',
    'telonjato',
    'efajato',
    'dimanjato',
    'enin-jato',
    'fitonjato',
    'valonjato',
    'sivinjato',
  ],
  LARGE_NUMBER_UNITS: [
    { threshold: 1_000_000_000_000_000_000, name: 'tsipesimpesinafaharoa' },
    { threshold: 100_000_000_000_000_000, name: 'alinkisafaharoa' },
    { threshold: 10_000_000_000_000_000, name: 'lavitrisafaharoa' },
    { threshold: 1_000_000_000_000_000, name: 'tsitamboisafaharoa' },
    { threshold: 100_000_000_000_000, name: 'safatsiroafaharoa' },
    { threshold: 10_000_000_000_000, name: 'tsitanoanoa' },
    { threshold: 1_000_000_000_000, name: 'tsitokotsiforohana' },
    { threshold: 100_000_000_000, name: 'tsipesimpesina' },
    { threshold: 10_000_000_000, name: 'alinkisa' },
    { threshold: 1_000_000_000, name: 'lavitrisa' },
    { threshold: 100_000_000, name: 'tsitamboisa' },
    { threshold: 10_000_000, name: 'safatsiroa' },
    { threshold: 1_000_000, name: 'tapitrisa' },
    { threshold: 100_000, name: 'hetsy' },
    { threshold: 10_000, name: 'alina' },
    { threshold: 1_000, name: 'arivo' },
  ] as const,

  MAX_SUPPORTED_INTEGER: 1_000_000_000_000_000_000 * 1000,
} as const

export type LargeNumberUnit =
  (typeof MalagasyNumerals.LARGE_NUMBER_UNITS)[number]
