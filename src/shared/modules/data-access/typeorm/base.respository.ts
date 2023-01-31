import {IRepository} from 'src/shared/core/interfaces/IRepository';
import {OrmName} from '../types/orm-name.enum';
import {InjectRepository} from '@nestjs/typeorm';
import {DeepPartial, FindManyOptions, JoinOptions, Repository} from 'typeorm';
import {Logger, Type} from '@nestjs/common';
import {PersistentEntity} from './base.entity';
import {IEntity} from 'src/shared/core/interfaces/IEntity';
import {PageParams} from '../../../core/PaginatorParams';
import {getDefaultPaginatedFindResult, PaginatedFindResult} from '../../../core/PaginatedFindResult';
import {FindAllResult, getDefaultFindAll} from '../../../core/FindAllResult';
import {QueryForm} from "./meta-mapper/query-form.type";
import {MetaMapper} from "./meta-mapper/meta-mapper.abstract-class";
import {v4 as uuidv4} from 'uuid'

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


    async deleteMany(filter): Promise<void> {
        await this._entityRepository.remove(filter)
    }

    async save(entity: E): Promise<void> {
        this._logger.debug(`Save entity with id: {${entity._id}}`);
        await this._entityRepository
            .create(this._domainToPersistentFunc(entity) as DeepPartial<P>)
            .save({transaction: false});
    }

    async update(entity: E, id: string): Promise<void> {
        this._logger.debug(`Update entity with id: {${id}}`);
        await this._entityRepository.update(id, this._domainToPersistentFunc(entity) as any);
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

    async findById(id: string, relations: string[] = []): Promise<E> {
        this._logger.log(`Find by id: ${id}`);
        const ans: P = await this._entityRepository.findOne(id, {
            relations: relations
        });
        if (ans)
            return this._persistToDomainFunc(ans);
        return null
    }

    async findAll(options: FindManyOptions<P>): Promise<FindAllResult<E>> {
        this._logger.log('Find All');

        const count = await this.count({where: options.where});

        if (count == 0) return getDefaultFindAll();

        const ans = await this._entityRepository.find(options);

        return {
            items: ans.map(this._persistToDomainFunc),
        };
    }

    async findOne(form: QueryForm): Promise<E> {
        this._logger.log(`Find`);
        const paginated = PageParams.create({pageNum: 1, pageLimit: 1}).getValue().unwrap()
        const ans: PaginatedFindResult<E> = await this.getPaginated(paginated, form)

        if (ans.items.length > 0) {
            return ans.items[0]
        }

        return null
    }

    getOrmName(): string {
        return OrmName.TYPE_ORM;
    }

    async count(filter: {}): Promise<number> {
        this._logger.log('Count');
        return await this._entityRepository.count(filter);
    }

    async getPaginated(paginatorParams: PageParams, form: QueryForm): Promise<PaginatedFindResult<E>> {
        this._logger.log('Paginated');

        class MapperImplementation extends MetaMapper<P> {
        }

        const mapper = new MapperImplementation()

        if (typeof form === 'string') form = JSON.parse(form as any) as QueryForm
        let queryBuilder = mapper._createQuery(form, this._entityRepository)

        const count = await queryBuilder.getCount()

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

        const subQuery = queryBuilder
            .clone()
            .select(`DISTINCT ${Object.keys(queryBuilder.expressionMap.orderBys).join(', ') || 'c.id'}`)
            .limit(pageLimit)
            .offset(findOffset)

        queryBuilder.setParameters(subQuery.getParameters())
        const selfJoinAlias = `selfJoin${uuidv4().split('-').join('')}`
        queryBuilder = queryBuilder.innerJoin(
            `(${subQuery.getQuery()})`,
            selfJoinAlias,
            `c.id = "${selfJoinAlias}".id`,
        )
        const [entities, _] = await queryBuilder.getManyAndCount()

        console.log(entities)
        const items = entities.map(this._persistToDomainFunc)
        return {
            items: items,
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
        return {skip, take: limit};
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
        return {skip, take: pageLimit};
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
