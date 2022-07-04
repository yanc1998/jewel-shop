import { CategoryDto } from './category.dto';

export type CategoryCreateDto = Omit<CategoryDto, 'id' | 'createdAt' | 'updatedAt'> & {
};
