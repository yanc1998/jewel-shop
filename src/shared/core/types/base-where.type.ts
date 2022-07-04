import { IQuantitativeFieldOptions } from '../../modules/data-access/types/IQuantitativeFieldOptions';

export type WhereType<T> = BaseWhereType<T> | BaseWhereType<T>[]

type BaseWhereType<T> = {
  [K in keyof BaseType<T>]?: BaseType<T>[K];
}

type BaseType<T> = T & {
  updatedAt: IQuantitativeFieldOptions<Date>;
  createdAt: IQuantitativeFieldOptions<Date>;
}
