export type OrderByType<T> = {
  [K in keyof BaseType<T>]?: 'ASC' | 'DESC';
}

type BaseType<T> = T & {
  id: string | number;
  updatedAt: Date;
  createdAt: Date;
}
