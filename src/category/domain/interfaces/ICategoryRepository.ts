import {IRepository} from '../../../shared/core/interfaces/IRepository';
import {Category} from '../entities/category.entity';

export interface ICategoryRepository extends IRepository<Category> {
    findDetails(id: string): Promise<Category>;
};
