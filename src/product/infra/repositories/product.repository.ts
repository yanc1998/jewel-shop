import {Injectable} from '@nestjs/common';
import {BaseRepository} from '../../../shared/modules/data-access/typeorm/base.respository';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Product} from '../../domain/entities/product.entity';
import {ProductPersistence} from '../entities/product.persistence';
import {ProductMappers} from '../mappers/product.mappers';
import {IProductRepository} from '../../domain/interfaces/IProductRepository';

@Injectable()
export class ProductRepository extends BaseRepository<Product, ProductPersistence> implements IProductRepository {
    constructor(@InjectRepository(ProductPersistence) _repository: Repository<ProductPersistence>) {
        super(_repository, ProductMappers.DomainToPersist, ProductMappers.PersistToDomain, 'ProductRepository');
    }

    async findDetails(id: string): Promise<Product> {
        const product = await this
            ._entityRepository
            .findOne(id);
        return ProductMappers.PersistToDomain(product);
    }
}
