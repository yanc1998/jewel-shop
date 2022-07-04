export type FindAllResult<T> = {
  items: T[];
}

export const getDefaultFindAll = <T>(): FindAllResult<T> => {
  return {
    items: [],
  };
};