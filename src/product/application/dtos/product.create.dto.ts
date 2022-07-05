import {ProductDto} from './product.dto';

export type ProductCreateDto = Omit<ProductDto, 'fileId' | 'id' | 'createdAt' | 'updatedAt'> & {
    file: any
};
