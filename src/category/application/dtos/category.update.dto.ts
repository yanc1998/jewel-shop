import {CategoryDto} from './category.dto';

export type CategoryUpdateDto = Omit<Partial<CategoryDto>, 'id'> & {
    categoryId: string;
    subcategoryIds: [{ id: string }];
};
