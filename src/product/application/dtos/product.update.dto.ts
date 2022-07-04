import {ProductDto} from './product.dto';

export type ProductUpdateDto = Omit<Partial<ProductDto>, 'id'> & {
    productId: string
};
