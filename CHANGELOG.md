# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-06-09

### Added

- **`.toDate(input, options?)`** — converts a `string | Date | number` to Malagasy date format.
  - Short format (default): `"25 Desambra 2022"`
  - Long format: `"dimy amby roapolo Desambra, taona roa amby roapolo sy roa arivo"`
  - Accepts ISO date strings, ISO datetime strings, `Date` objects, and Unix timestamps (ms)
  - Correctly avoids UTC midnight timezone drift for ISO date strings
- **`.toTime(input, options?)`** — converts a `string | Date | number` to Malagasy spoken time with the correct time-of-day period (_maraina, antoandro, tolakandro, hariva, alina_).
  - Configurable `precision: 'minutes' | 'seconds'`
  - Accepts `HH:MM`, `HH:MM:SS`, ISO datetime strings, `Date` objects, and Unix timestamps (ms)
- New exported types: `TanisaDateOptions`, `DateFormat`, `TanisaTimeOptions`, `TimePrecision`

### Fixed

- `toWords()` now throws `TypeError` for scientific-notation string inputs (e.g. `'1e15'`) instead of silently returning the word for `1`
- `toWords()` now throws `RangeError` for negative fractional inputs such as `'-0.5'` (previously treated as `+0.5`)
- `toDate()` now throws `TypeError` for ISO strings with out-of-range month or day (e.g. `'2024-13-99'`) instead of producing `'undefined'` in the output
- `toTime()` now throws `TypeError` for negative time components (e.g. `'-1:30'`) instead of an opaque `RangeError` from deep in the call stack
- `toTime()` now throws `TypeError` for time components with trailing non-digit characters (e.g. `'23abc:00'`)

### Changed

- Source split into focused modules: `src/tanisa.ts` (class), `src/date.ts`, `src/time.ts`, `src/utils.ts`; `src/converter.ts` is now the barrel entry point
- Shared `Date`/timestamp input validation extracted to `src/utils.ts` (`inputToNativeDate`)
- `'taona'` and `'sy'` (used in formatters) moved to dictionary constants `YEAR_UNIT` and `CONJ_SY`

## [1.1.5] - 2026-05-18

### Fixed

- Numbers 11–19 now correctly use `ambin'ny folo` instead of `amby folo` ([#6](https://github.com/nifaliana/tanisa/issues/6))
- Fixed two incorrect examples in the README showing wrong output for teens
- Excluded `.claude` directory from Vitest test discovery
