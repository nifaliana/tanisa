/**
 * Shared helpers for normalising the `string | Date | number` input union.
 * Both parseDate (date.ts) and parseTime (time.ts) accept the same input types;
 * the Date-object and numeric-timestamp branches are identical — extracted here
 * to keep the two parsers in sync automatically.
 */

/**
 * Coerce a `Date` or numeric timestamp into a validated native `Date`.
 * Throws `TypeError` on invalid inputs so callers receive a consistent error.
 * String handling is intentionally left to each parser (date vs. time strings
 * follow different formats).
 */
export function inputToNativeDate(input: Date | number): Date {
  if (input instanceof Date) {
    if (isNaN(input.getTime())) throw new TypeError('Invalid Date object')
    return input
  }
  const d = new Date(input)
  if (isNaN(d.getTime())) throw new TypeError(`Invalid timestamp: "${input}"`)
  return d
}
