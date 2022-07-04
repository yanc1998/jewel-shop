import {Injectable} from '@nestjs/common';
import {BaseRepository} from '../../../shared/modules/data-access/typeorm/base.respository';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Category} from '../../domain/entities/category.entity';
import {CategoryPersistence} from '../entities/category.persistence';
import {CategoryMappers} from '../mappers/category.mappers';
import {ICategoryRepository} from '../../domain/interfaces/ICategoryRepository';

@Injectable()
export class CategoryRepository extends BaseRepository<Category, CategoryPersistence> implements ICategoryRepository {
    constructor(@InjectRepository(CategoryPersistence) _repository: Repository<CategoryPersistence>) {
        super(_repository, CategoryMappers.DomainToPersist, CategoryMappers.PersistToDomain, 'CategoryRepository');
    }

    async findDetails(id: string): Promise<Category> {
        const category = await this
            ._entityRepository
            .findOne(id, {
                relations: ['subcategories'],
            });

        return CategoryMappers.PersistToDomain(category);
    }
}
