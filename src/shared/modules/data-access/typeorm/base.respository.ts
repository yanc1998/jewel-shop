import { IRepository } from 'src/shared/core/interfaces/IRepository';
import { OrmName } from '../types/orm-name.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Logger, Type } from '@nestjs/common';
import { PersistentEntity } from './base.entity';
import { IEntity } from 'src/shared/core/interfaces/IEntity';
import { PageParams } from '../../../core/PaginatorParams';
import { getDefaultPaginatedFindResult, PaginatedFindResult } from '../../../core/PaginatedFindResult';
import { FindAllResult } from '../../../core/FindAllResult';

export abstract class BaseRepository<E extends IEntity,
  P extends PersistentEntity> implements IRepository<E> {
  protected readonly _logger: Logger;

  constructor(
    @InjectRepository(
      (): Type<P> => {
        return {} as Type<P>;
      },
    )
    protected readonly _entityRepository: Repository<P>,
    private readonly _domainToPersistentFunc: (domainEntity: E) => Partial<P>,
    private readonly _persistToDomainFunc: (persistEntity: P) => E,
    context: string,
  ) {
    this._logger = new Logger(context);
  }

  async save(entity: E): Promise<void> {
    this._logger.debug(`Save entity with id: {${entity._id}}`);
    await this._entityRepository
      .create(this._domainToPersistentFunc(entity) as DeepPartial<P>)
      .save({ transaction: false });
  }

  async update(entity: E, id: string): Promise<void> {
    this._logger.debug(`Update entity with id: {${id}}`);
    await this._entityRepository.update({ id: id }, this._domainToPersistentFunc(entity) as DeepPartial<P>);
  }

  async saveMany(entities: E[]): Promise<void> {
    let subArr = new Array<E>();
    while (entities.length > 0) {
      if (entities.length > 500) subArr = entities.splice(0, 500);
      else subArr = entities.splice(0, entities.length);
      await this._entityRepository.save(
        subArr.map((entity: E) => {
          this._logger.debug(`Save entity with id: {${entity._id}}`);
          return this._domainToPersistentFunc(entity) as DeepPartial<P>;
        }),
      );
    }
  }

  async drop(entity: E): Promise<void> {
    this._logger.log(`Drop entity with id: {${entity._id}}`);
    await this._entityRepository
      .create(this._domainToPersistentFunc(entity) as DeepPartial<P>)
      .remove();
  }

  async findById(id: string): Promise<E> {
    this._logger.log(`Find by id: ${id}`);
    const ans: P = await this._entityRepository.findOne(id);
    return this._persistToDomainFunc(ans);
  }

  async findAll(filter: {}): Promise<FindAllResult<E>> {
    this._logger.log('Find All');

    const count = await this.count(filter);

    if (count == 0) return getDefaultPaginatedFindResult();

    const ans = await this._entityRepository.find({
      where: filter,
    });

    return {
      items: ans.map(this._persistToDomainFunc),
    };
  }

  async findOne(filter: {}): Promise<E> {
    this._logger.log(`Find`);
    const ans: P = await this._entityRepository.findOne(filter);
    return this._persistToDomainFunc(ans);
  }

  getOrmName(): string {
    return OrmName.TYPE_ORM;
  }

  async count(filter: {}): Promise<number> {
    this._logger.log('Count');
    return await this._entityRepository.count(filter);
  }

  async getPaginated(paginatorParams: PageParams, filter: {}): Promise<PaginatedFindResult<E>> {
    this._logger.log('Paginated');

    const count = await this.count(filter);

    if (count == 0) return getDefaultPaginatedFindResult();

    const pageLimit: number =
      paginatorParams.pageLimit < count
        ? paginatorParams.pageLimit
        : count;
    const totalPages: number = Math.ceil(count / pageLimit);
    const currentPage: number =
      paginatorParams.pageNum < totalPages
        ? paginatorParams.pageNum
        : totalPages;

    const pageNum: number =
      paginatorParams.pageNum < totalPages
        ? paginatorParams.pageNum
        : totalPages;

    const findOffset = pageLimit * (pageNum - 1);

    const entities = await this._entityRepository.find({
      where: filter,
      skip: findOffset,
      take: pageLimit,
    });

    return {
      items: entities.map(this._persistToDomainFunc),
      limit: pageLimit,
      currentPage,
      totalPages,
    };
  }

  /**
   *
   * @deprecated
   * @protected
   * @param {PageParams} [pageParam]
   * @returns  {SkipAndLimitType}
   * @memberof BaseRepository
   */
  protected extractLimitAndSkip(pageParam?: PageParams): SkipAndLimitType {
    const limit = pageParam?.pageLimit || 10;
    const page = pageParam?.pageNum || 1;
    const skip = limit * (page - 1);
    return { skip, take: limit };
  }

  /**
   *
   *
   * @protected
   * @param {number} [pageLimit=10]
   * @param {number} [pageNumber=1]
   * @returns  {SkipAndLimitType}
   * @memberof BaseRepository
   */
  protected extractLimitAndSkipFromRaw(
    pageLimit: number = 10,
    pageNumber: number = 1,
  ): SkipAndLimitType {
    const skip = pageLimit * (pageNumber - 1);
    return { skip, take: pageLimit };
  }

  protected buildPaginated<E>(
    skip: number,
    limit: number,
    count: number,
    items: E[],
  ): PaginatedFindResult<E> {
    const totalPages: number = Math.ceil(count / limit);
    const currentPage: number = Math.min(skip / limit + 1, totalPages);
    return {
      items,
      limit,
      currentPage,
      totalPages,
    };
  }
}

type SkipAndLimitType = {
  skip: number;
  take: number;
};
