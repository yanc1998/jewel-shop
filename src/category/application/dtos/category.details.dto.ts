import {CategoryDto} from './category.dto';
import {SubcategoryDto} from "../../../subcategory/application/dtos/subcategory.dto";

export type CategoryDetailsDto = CategoryDto & {
    subcategories: SubcategoryDto[],
}
