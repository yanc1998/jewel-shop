/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldOptions, FieldOptionsKeys } from '../types/IFieldOptions';
import {
  QualitativeFieldOptions,
  QualitativeFieldOptionsKeys,
} from '../types/IQualitativeFieldOptions';
import {
  IQuantitativeFieldOptions,
  QuantitativeFieldOptionsKeys,
  IBetween,
} from '../types/IQuantitativeFieldOptions';
import {
  Equal,
  IsNull,
  Any,
  Not,
  In,
  ILike,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Between,
} from 'typeorm';

export class TypeORMDataAccessUtils {
  static parseFieldOption<T>(fieldOptions: FieldOptions<T>): any {
    const [key, value] = Object.entries(fieldOptions).pop();
    switch (key) {
      case FieldOptionsKeys.IS_NULL:
        return IsNull();
      case FieldOptionsKeys.ANY:
        return Any(value as T[]);
      case FieldOptionsKeys.IS:
        return Equal(value);
      case FieldOptionsKeys.NOT:
        return Not(Equal(value));
      case FieldOptionsKeys.IN:
        return In(value as T[]);
      case FieldOptionsKeys.NOT_IN:
        return Not(In(value as T[]));
    }
  }

  static parseQualitativeFieldOption(
    strFieldOptions: QualitativeFieldOptions,
  ): any {
    const [key, value] = Object.entries(strFieldOptions).pop();
    switch (key) {
      case QualitativeFieldOptionsKeys.CONTAINS:
        return ILike(`%${value}%`);
      case QualitativeFieldOptionsKeys.NOT_CONTAINS:
        return Not(ILike(`%${value}%`));
      case QualitativeFieldOptionsKeys.STARTS_WITH:
        return ILike(`${value}%`);
      case QualitativeFieldOptionsKeys.NOT_STARTS_WITH:
        return Not(ILike(`${value}%`));
      case QualitativeFieldOptionsKeys.ENDS_WITH:
        return ILike(`%${value}`);
      case QualitativeFieldOptionsKeys.NOT_ENDS_WITH:
        return Not(ILike(`%${value}`));
      default:
        return this.parseFieldOption(strFieldOptions);
    }
  }

  static parseQuantitativeFieldOption(
    numFieldOption: IQuantitativeFieldOptions,
  ): any {
    const [key, value] = Object.entries(numFieldOption).pop();
    switch (key) {
      case QuantitativeFieldOptionsKeys.LT:
        return LessThan(value);
      case QuantitativeFieldOptionsKeys.LTE:
        return LessThanOrEqual(value);
      case QuantitativeFieldOptionsKeys.GT:
        return MoreThan(value);
      case QuantitativeFieldOptionsKeys.GTE:
        return MoreThanOrEqual(value);
      case QuantitativeFieldOptionsKeys.BETWEEN:
        return Between((value as IBetween).from, (value as IBetween).to);
      default:
        return this.parseFieldOption(numFieldOption);
    }
  }
}
