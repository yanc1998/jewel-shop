/**
 * Interface to represent a array field to use in 'where' statement in findAll queries.
 *
 * @export
 * @type ArrayFieldOptions
 * @template T
 */
export type ArrayFieldOptions<T> = {
  /**
   * Array<T> is null
   *
   * @type {boolean}
   */
  isNull?: boolean;
  /**
   * Array<T> contain all passed T values.
   *
   * @type {T[]}
   */
  contain?: T[];
  /**
   * Array<T> doesn't contain any of the passed T values.
   *
   * @type {T[]}
   */
  notContain?: T[];
  /**
   * Array<T> contain at least one of the passed T values.
   *
   * @type {T[]}
   */
  containAny?: T[];
  /**
   * Array<T> doesn't contain at least one of the passed T values.
   *
   * @type {T[]}
   */
  notContainAny?: T[];
  /**
   *Array<T> is exactly equal to the passed T[].
   *
   * @type {T[]}
   */
  is?: T[];
  /**
   * Array<T> isn't exactly equal to the passed T[].
   *
   * @type {T[]}
   */
  notIs?: T[];
};

export enum ArrayFieldOptionsKeys {
  IS_NULL = 'isNull',
  CONTAIN = 'contain',
  NOT_CONTAIN = 'notContain',
  CONTAIN_ANY = 'containAny',
  NOT_CONTAIN_ANY = 'notContainAny',
  IS = 'is',
  NOT_IS = 'notIs',
}
