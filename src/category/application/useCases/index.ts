import {CreateCategoryUseCase} from './category.create.use-case';
import {PaginatedCategoryUseCase} from './category.paginated.use-case';
import {RemoveCategoryUseCase} from './category.remove.use-case';
import {UpdateTeacherUseCase} from './category.update.use-case';
import {FindByIdCategoryUseCase} from './category.find-by-id.use-case';


export * from './category.create.use-case';
export * from './category.paginated.use-case';
export * from './category.remove.use-case';
export * from './category.update.use-case';
export * from './category.find-by-id.use-case';


export const CategoryUseCases = [
    CreateCategoryUseCase,
    PaginatedCategoryUseCase,
    RemoveCategoryUseCase,
    UpdateTeacherUseCase,
    FindByIdCategoryUseCase,

];
