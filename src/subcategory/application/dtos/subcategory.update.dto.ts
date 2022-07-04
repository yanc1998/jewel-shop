import {SubcategoryDto} from './subcategory.dto';

export type SubcategoryUpdateDto = Omit<Partial<SubcategoryDto>, 'id'> & {
    subcategoryId: string;
};
