import {Injectable} from '@nestjs/common';
import {BaseRepository} from '../../../shared/modules/data-access/typeorm/base.respository';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Subcategory} from '../../domain/entities/subcategory.entity';
import {SubcategoryPersistence} from '../entities/subcategory.persistence';
import {SubcategoryMappers} from '../mappers/subcategoryMappers';
import {ISubcategoryRepository} from '../../domain/interfaces/ISubcategoryRepository';

@Injectable()
export class SubcategoryRepository extends BaseRepository<Subcategory, SubcategoryPersistence> implements ISubcategoryRepository {
    constructor(@InjectRepository(SubcategoryPersistence) _repository: Repository<SubcategoryPersistence>) {
        super(_repository, SubcategoryMappers.DomainToPersist, SubcategoryMappers.PersistToDomain, 'SubcategoryRepository');
    }

    async findDetails(id: string): Promise<Subcategory> {
        const subcategory = await this
            ._entityRepository
            .findOne(id, {
                relations: ['products'],
            });

        return SubcategoryMappers.PersistToDomain(subcategory);
    }
}
