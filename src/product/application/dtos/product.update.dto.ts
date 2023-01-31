import {ProductCreateDto} from "./product.create.dto";

export type ProductUpdateDto = Partial<ProductCreateDto> & {
    productId: string
};
