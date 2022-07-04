import {IRepository} from '../../../shared/core/interfaces/IRepository';
import {Subcategory} from '../entities/subcategory.entity';

export interface ISubcategoryRepository extends IRepository<Subcategory> {
    findDetails(id: string): Promise<Subcategory>;
};
