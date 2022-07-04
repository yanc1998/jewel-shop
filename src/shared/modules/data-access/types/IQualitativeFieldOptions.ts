import { FieldOptions } from './IFieldOptions';

/**
 * Interface to represent a qualitative field to use in 'where' statement in findAll queries.
 *
 * @export
 * @type QualitativeFieldOptions
 */
export type QualitativeFieldOptions = FieldOptions<string> & {
  contains?: string;
  notContains?: string;
  startsWith?: string;
  notStartsWith?: string;
  endsWith?: string;
  notEndsWith?: string;
};

export enum QualitativeFieldOptionsKeys {
  CONTAINS = 'contains',
  NOT_CONTAINS = 'notContains',
  STARTS_WITH = 'startsWith',
  NOT_STARTS_WITH = 'notStartsWith',
  ENDS_WITH = 'endsWith',
  NOT_ENDS_WITH = 'notEndsWith',
}
