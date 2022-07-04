import {SubcategoryDto} from './subcategory.dto';
import {ProductDto} from "../../../product/application/dtos/product.dto";

export type SubcategoryDetailsDto = SubcategoryDto & {
    products: ProductDto[],
}
