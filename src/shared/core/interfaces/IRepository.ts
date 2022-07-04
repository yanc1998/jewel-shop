export interface IRepository<T> {
  /**
   * Persist an entity in the repository, if an entity exists, update it.
   *
   * @param {T} entity
   * @returns  {(Promise<void> | void)}
   * @memberof IRepository
   */
  save(entity: T): Promise<void> | void;

  /**
 * Update an entity in the repository, if an entity exists, update it.
 *
 * @param {T} entity
 * @returns  {(Promise<void> | void)}
 * @memberof IRepository
 */
  update(entity: T, id: string): Promise<void> | void;

  /**
   * Persist many entities in the repository, if an entity exists, update it.
   *
   * @param {T} entity
   * @returns  {(Promise<void> | void)}
   * @memberof IRepository
   */
  saveMany?(entity: T[]): Promise<void> | void;

  /**
   * Drop an entity from the repository.
   *
   * @param {T} entity
   * @returns  {(Promise<void> | void)}
   * @memberof IRepository
   */
  drop(entity: T): Promise<void> | void;

  /**
   * Find entity by Id
   *
   * @param id
   */
  findById(id: string): Promise<T> | void;


  /**
  * Find entity by filter
  *
  * @param filter
  */
  findOne(filter: {}): Promise<T> | void;

  getOrmName(): string;
}

export interface IRepositoryFactory<E, T extends IRepository<E>> {
  getOrmName(): string;

  build(dbContext: unknown): T;
}
