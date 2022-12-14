import { Nullable } from './types';

/**
 * Create a new function which calls all functions given.
 *
 * @example
 * const paintWall = (color: string) => {};
 * const paintCeiling = (color: string) => {};
 * const paintHouse = callAll(paintWall, paintCeiling);
 * paintHouse('white');
 *
 *
 * @example Functions can be null/false to skip to help with conditionals.
 * callAll(
 *   ifThing ? conditionalFn : null,
 *   ifThing && conditionalFn,
 * )
 */
export const callAll =
  <Args extends any[]>(
    ...fns: Array<Nullable<(...args: Args) => void> | false>
  ) =>
  (...args: Args) => {
    for (const fn of fns) {
      if (!fn) {
        continue;
      }
      fn(...args);
    }
  };

/**
 * Create a new function which calls each function given
 * and returns the first one with a truthy result.
 *
 * @example
 * const verifyEmail = callSome(
 *   verifyString,
 *   verifyLength,
 *   verifyRegexFormat,
 * );
 * const maybeError = verifyEmail('');
 *
 * @example Functions can be null/false to skip to help with conditionals.
 * callSome(
 *   ifThing ? conditionalFn : null,
 *   ifThing && conditionalFn,
 * )
 */
export const callSome =
  <Args extends any[], Return>(
    ...fns: Array<Nullable<(...args: Args) => Return> | false>
  ) =>
  (...args: Args): Return | undefined => {
    for (const fn of fns) {
      if (!fn) {
        continue;
      }
      const result = fn(...args);
      if (result) {
        return result;
      }
    }
  };
