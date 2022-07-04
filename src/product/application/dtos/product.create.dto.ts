import {ProductDto} from './product.dto';

export type ProductCreateDto = Omit<ProductDto, 'id' | 'createdAt' | 'updatedAt'> & {};
