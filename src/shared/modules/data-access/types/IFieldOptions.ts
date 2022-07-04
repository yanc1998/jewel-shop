/**
 * Basic search conditions to use in all field of the 'where' statement in the findAll query.
 *
 * @export
 * @type IFieldOptions
 * @template T
 */
export type FieldOptions<T> = {
  isNull?: boolean;
  any?: T[];
  is?: T;
  not?: T;
  in?: T[];
  notIn?: T[];
};

export enum FieldOptionsKeys {
  IS_NULL = 'isNull',
  ANY = 'any',
  IS = 'is',
  NOT = 'not',
  IN = 'in',
  NOT_IN = 'notIn',
}
