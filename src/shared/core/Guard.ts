import { IGuardArgument } from './interfaces/IGuardArgument';
import { IGuardResult } from './interfaces/IGuardResult';

export type GuardArgumentCollection<T> = IGuardArgument<T>[];

const getSuccessResult = (argumentPath: string): IGuardResult => ({
  succeeded: true,
  message: `${argumentPath}.correct`,
});

export class Guard {
  /**
   * Determine if the actual value is greather than the minimal value.
   *
   * @static
   * @param {number} minValue
   * @param {number} actualValue
   * @param {string} argumentPath
   * @returns  {IGuardResult}
   * @memberof Guard
   */
  public static greaterThan(
    minValue: number,
    actualValue: number,
    argumentPath: string,
  ): IGuardResult {
    return actualValue > minValue
      ? getSuccessResult(argumentPath)
      : {
        succeeded: false,
        message: `${argumentPath} should be greater than ${minValue}`,
      };
  }

  /**
   * Determine if the actual value is greather than or equal to the minimal value.
   *
   * @static
   * @param {number} minValue
   * @param {number} actualValue
   * @param {string} argumentPath
   * @returns  {IGuardResult}
   * @memberof Guard
   */
  public static greaterThanEqual(
    minValue: number,
    actualValue: number,
    argumentPath: string,
  ): IGuardResult {
    return actualValue >= minValue
      ? getSuccessResult(argumentPath)
      : {
        succeeded: false,
        message: `${argumentPath} should be greater than ${minValue}`,
      };
  }

  /**
   * Determine if the actual value is lesser than the max value.
   *
   * @static
   * @param {number} maxValue
   * @param {number} actualValue
   * @param {string} argumentPath
   * @returns  {IGuardResult}
   * @memberof Guard
   */
  public static lesserThan(
    maxValue: number,
    actualValue: number,
    argumentPath: string,
  ): IGuardResult {
    return actualValue < maxValue
      ? getSuccessResult(argumentPath)
      : {
        succeeded: false,
        message: `${argumentPath} should be lesser than ${maxValue}`,
      };
  }

  /**
   * Determine if the actual value is greather than or equal to the minimal value.
   *
   * @static
   * @param {number} minValue
   * @param {number} actualValue
   * @param {string} argumentPath
   * @returns  {IGuardResult}
   * @memberof Guard
   */
  public static lesserThanEqual(
    maxValue: number,
    actualValue: number,
    argumentPath: string,
  ): IGuardResult {
    return actualValue <= maxValue
      ? getSuccessResult(argumentPath)
      : {
        succeeded: false,
        message: `${argumentPath} should be lesser than ${maxValue}`,
      };
  }

  /**
   * Determines whether or not the number of elements of all arguments in the sequence are greater than or equal the given number.
   *
   * @static
   * @param {number} numChars
   * @param {GuardArgumentCollection<unknown>} args
   * @returns  {IGuardResult}
   * @memberof Guard
   */
  public static allAtLeast(
    numChars: number,
    args: IGuardArgument<string>[],
  ): IGuardResult {
    for (const arg of args) {
      const result = this.againstAtLeast({ numChars, ...arg });
      if (!result.succeeded) return result;
    }
    return getSuccessResult(args[0].argumentPath);
  }

  /**
   * Determines whether or not the number of elements in the sequence is greater than or equal to the given number.
   *
   * @static
   * @param {{
   *     numChars: number;
   *     argument: string;
   *     argumentPath: string;
   *   }} {
   *     argumentPath,
   *     numChars,
   *     argument,
   *   }
   * @returns  {IGuardResult}
   * @memberof Guard
   */
  public static againstAtLeast({
    argumentPath,
    numChars,
    argument,
  }: {
    numChars: number;
    argument: string;
    argumentPath: string;
  }): IGuardResult {
    return argument.length >= numChars
      ? getSuccessResult(argumentPath)
      : {
        succeeded: false,
        message: `${argumentPath} should has at least ${numChars} chars`,
      };
  }

  /**
   * Determines whether or not the number of elements of all arguments in the sequence are lesser than or equal the given number.
   *
   * @static
   * @param {number} numChars
   * @param {IGuardArgument[]} args
   * @returns  {IGuardResult}
   * @memberof Guard
   */
  public static allAtMost(
    numChars: number,
    args: IGuardArgument<string>[],
  ): IGuardResult {
    for (const arg of args) {
      const result = this.againstAtMost({ numChars, ...arg });
      if (!result.succeeded) return result;
    }
    return getSuccessResult(args[0].argumentPath);
  }

  /**
   * Determines whether or not the number of elements in the sequence is lesser than or equal to the given number.
   *
   * @static
   * @param {{
   *     numChars: number;
   *     argument: string;
   *     argumentPath: string;
   *   }} {
   *     numChars,
   *     argumentPath,
   *     argument,
   *   }
   * @returns  {IGuardResult}
   * @memberof Guard
   */
  public static againstAtMost({
    numChars,
    argumentPath,
    argument,
  }: {
    numChars: number;
    argument: string;
    argumentPath: string;
  }): IGuardResult {
    return argument.length <= numChars
      ? getSuccessResult(argumentPath)
      : {
        succeeded: false,
        message: `${argumentPath} should be lower than ${numChars} chars`,
      };
  }

  /**
   * Determines if value isn't null or undefined.
   *
   * @static
   * @param {unknown} argument
   * @param {string} argumentPath
   * @returns  {IGuardResult}
   * @memberof Guard
   */
  public static againstNullOrUndefined(
    argument: unknown,
    argumentPath: string,
  ): IGuardResult {
    if (argument === null || argument === undefined) {
      return {
        succeeded: false,
        message: `${argumentPath} should be defined`,
      };
    } else {
      return getSuccessResult(argumentPath);
    }
  }

  /**
   * Determines if all arguments aren't null or undefined.
   *
   * @static
   * @param {GuardArgumentCollection<unknown>} args
   * @returns  {IGuardResult}
   * @memberof Guard
   */
  public static againstNullOrUndefinedBulk(
    args: GuardArgumentCollection<unknown>,
  ): IGuardResult {
    for (const arg of args) {
      const result = this.againstNullOrUndefined(
        arg.argument,
        arg.argumentPath,
      );
      if (!result.succeeded) return result;
    }
    return getSuccessResult(args[0].argumentPath);
  }

  /**
   * Determines if value exist in valid values list.
   *
   * @static
   * @param {{
   *     value: any;
   *     validValues: any[];
   *     argumentPath: string;
   *   }} {
   *     value,
   *     validValues,
   *     argumentPath,
   *   }
   * @returns  {IGuardResult}
   * @memberof Guard
   */
  public static isOneOf<T>({
    value,
    validValues,
    argumentPath,
  }: {
    value: T;
    validValues: T[];
    argumentPath: string;
  }): IGuardResult {
    let isValid = false;
    for (const validValue of validValues) {
      if (value === validValue) {
        isValid = true;
      }
    }

    if (isValid) {
      return getSuccessResult(argumentPath);
    } else {
      return {
        succeeded: false,
        message: `${argumentPath} is invalid type`,
      };
    }
  }

  /**
   * Determines if value is between min and max value.
   *
   * @static
   * @param {{
   *     num: number;
   *     min: number;
   *     max: number;
   *     argumentPath: string;
   *   }} {
   *     argumentPath,
   *     max,
   *     min,
   *     num,
   *   }
   * @returns  {IGuardResult}
   * @memberof Guard
   */
  public static inRange({
    argumentPath,
    max,
    min,
    num,
  }: {
    num: number;
    min: number;
    max: number;
    argumentPath: string;
  }): IGuardResult {
    const isInRange = num >= min && num <= max;
    if (!isInRange) {
      return {
        succeeded: false,
        message: `${argumentPath} should be within range ${min} to ${max}`,
      };
    } else {
      return getSuccessResult(argumentPath);
    }
  }

  /**
   * Determines if all arguments are between min and max values.
   *
   * @static
   * @param {{
   *     min: number;
   *     max: number;
   *     args: IGuardArgument[];
   *   }} {
   *     min,
   *     max,
   *     args,
   *   }
   * @returns  {IGuardResult}
   * @memberof Guard
   */
  public static allInRange({
    min,
    max,
    args,
  }: {
    min: number;
    max: number;
    args: IGuardArgument<number>[];
  }): IGuardResult {
    let failingResult: IGuardResult | null = null;
    for (const { argument, argumentPath } of args) {
      const numIsInRangeResult = this.inRange({
        num: argument,
        min,
        max,
        argumentPath,
      });
      if (!numIsInRangeResult.succeeded) failingResult = numIsInRangeResult;
    }

    if (failingResult) {
      return failingResult;
    } else {
      return getSuccessResult(args[0].argumentPath);
    }
  }

  /**
   * Determines if list is of type string[].
   *
   * @static
   * @param {unknown} list
   * @param {string} argumentPath
   * @returns  {IGuardResult}
   * @memberof Guard
   */
  public static isListOfStrings(
    list: unknown,
    argumentPath: string,
  ): IGuardResult {
    let failingResult: IGuardResult | null = null;

    if (!Array.isArray(list)) {
      return {
        succeeded: false,
        message: `${argumentPath} should be array`,
      };
    }

    if (list.length === 0) {
      return {
        succeeded: false,
        message: `${argumentPath} should be not empty`,
      };
    }

    for (const item in list) {
      const isStringResult = this.isString(item, 'listItem');
      if (!isStringResult.succeeded) {
        failingResult = isStringResult;
      }
    }

    if (failingResult) {
      return {
        succeeded: false,
        message: `${argumentPath} all items should be type of string`,
      };
    }
    return getSuccessResult(argumentPath);
  }

  /**
   * Determines if all values are of type 'string'.
   *
   * @static
   * @param {GuardArgumentCollection<unknown>} args
   * @returns  {IGuardResult}
   * @memberof Guard
   */
  public static AllisString(
    args: GuardArgumentCollection<unknown>,
  ): IGuardResult {
    for (const arg of args) {
      const result = this.isString(arg.argument, arg.argumentPath);
      if (!result.succeeded) return result;
    }
    return getSuccessResult(args[0].argumentPath);
  }

  /**
   * Determines if value is of type 'string'.
   *
   * @static
   * @param {unknown} value
   * @param {string} argumentPath
   * @returns  {IGuardResult}
   * @memberof Guard
   */
  public static isString(value: unknown, argumentPath: string): IGuardResult {
    if (typeof value === 'string' || value instanceof String) {
      return getSuccessResult(argumentPath);
    }

    return {
      succeeded: false,
      message: `${argumentPath} should be string`,
    };
  }

  /**
   * Determines if all values are of type 'number'.
   *
   * @static
   * @param {GuardArgumentCollection<unknown>} args
   * @returns  {IGuardResult}
   * @memberof Guard
   */
  public static allIsNumber(
    args: GuardArgumentCollection<unknown>,
  ): IGuardResult {
    for (const arg of args) {
      const result = this.isNumber(arg.argument, arg.argumentPath);
      if (!result.succeeded) return result;
    }
    return getSuccessResult(args[0].argumentPath);
  }

  /**
   * Determines if value is of type 'number'.
   *
   * @static
   * @param {unknown} value
   * @param {string} argumentPath
   * @returns  {IGuardResult}
   * @memberof Guard
   */
  public static isNumber(value: unknown, argumentPath: string): IGuardResult {
    if (typeof value === 'number') {
      return getSuccessResult(argumentPath);
    }
    return {
      succeeded: false,
      message: `${argumentPath} should be number`,
    };
  }

  public static StringMatch(
    argument: string,
    pattern: RegExp,
    argumentPath: string,
  ): IGuardResult {
    if (pattern.test(argument)) {
      return getSuccessResult(argumentPath);
    }
    return {
      succeeded: false,
      message: `${argumentPath} should match with ${pattern}`,
    };
  }

  public static StringMatchBulk(
    args: GuardArgumentCollection<string>,
    pattern: RegExp,
  ): IGuardResult {
    for (const val of args) {
      const result = this.StringMatch(val.argument, pattern, val.argumentPath);
      if (!result.succeeded) return result;
    }
    return getSuccessResult(args[0].argumentPath);
  }
}
