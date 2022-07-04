import {SubcategoryDto} from './subcategory.dto';

export type SubcategoryCreateDto = Omit<SubcategoryDto, 'id' | 'createdAt' | 'updatedAt'> & {};
