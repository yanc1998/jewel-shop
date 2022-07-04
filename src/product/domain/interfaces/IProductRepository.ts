import {IRepository} from '../../../shared/core/interfaces/IRepository';
import {Product} from '../entities/product.entity';

export interface IProductRepository extends IRepository<Product> {
    findDetails(id: string): Promise<Product>;
};
