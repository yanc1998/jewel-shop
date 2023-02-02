import {CreateProductUseCase} from './product.create.use-case';
import {PaginatedProductUseCase} from './product.paginated.use-case';
import {RemoveProductUseCase} from './product.remove.use-case';
import {UpdateProductUseCase} from './product.update.use-case';
import {FindByIdProductUseCase} from './product.find-by-id.use-case';
import {FindDetailsProductUseCase} from './product.get-one-details.use-case';
import {ReserveProductUseCase} from "./reserve.use-case";

export * from './product.create.use-case';
export * from './product.paginated.use-case';
export * from './product.remove.use-case';
export * from './product.update.use-case';
export * from './product.find-by-id.use-case';
export * from './product.get-one-details.use-case';

export const ProductUseCases = [
    CreateProductUseCase,
    PaginatedProductUseCase,
    RemoveProductUseCase,
    UpdateProductUseCase,
    FindByIdProductUseCase,
    FindDetailsProductUseCase,
    ReserveProductUseCase
];
