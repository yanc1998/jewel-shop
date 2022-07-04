import { FieldOptions } from './IFieldOptions';

/**
 * Represent a object used in a 'where between' sentence.
 *
 * @export
 * @type IBetween
 * @template T
 */
export type IBetween<T = number | Date> = {
  from: T;
  to: T;
};

/**
 * Interface to represent a quantitative field to use in 'where' statement in findAll queries.
 *
 * @export
 * @type IQuantitativeFieldOptions
 * @extends {IFieldOptions<T>}
 * @template T
 */
export type IQuantitativeFieldOptions<T = number | Date> = FieldOptions<T> & {
  lt?: T;
  lte?: T;
  gt?: T;
  gte?: T;
  between?: IBetween<T>;
};

export enum QuantitativeFieldOptionsKeys {
  LT = 'lt',
  LTE = 'lte',
  GT = 'gt',
  GTE = 'gte',
  BETWEEN = 'between',
}
