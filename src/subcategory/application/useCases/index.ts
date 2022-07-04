import {CreateSubcategoryUseCase} from './subcategory.create.use-case';
import {PaginatedTeacherUseCase} from './subcategory.paginated.use-case';
import {RemoveSubcategoryUseCase} from './subcategory.remove.use-case';
import {UpdateTeacherUseCase} from './subcategory.update.use-case';
import {FindByIdSubcategoryUseCase} from './subcategory.find-by-id.use-case';

export * from './subcategory.create.use-case';
export * from './subcategory.paginated.use-case';
export * from './subcategory.remove.use-case';
export * from './subcategory.update.use-case';
export * from './subcategory.find-by-id.use-case';


export const SubcategoryUseCases = [
    CreateSubcategoryUseCase,
    PaginatedTeacherUseCase,
    RemoveSubcategoryUseCase,
    UpdateTeacherUseCase,
    FindByIdSubcategoryUseCase,
];
