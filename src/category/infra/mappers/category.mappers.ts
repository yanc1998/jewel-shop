import {CategoryPersistence} from '../entities/category.persistence';
import {Category} from '../../domain/entities/category.entity';
import {PaginatedFindResult} from '../../../shared/core/PaginatedFindResult';
import {CategoryDto} from '../../application/dtos/category.dto';
import {CategoryDetailsDto} from '../../application/dtos/category.details.dto';
import {SubcategoryMappers} from "../../../subcategory/infra/mappers/subcategoryMappers";

export class CategoryMappers {
    public static PersistToDomain(persist: CategoryPersistence): Category {
        const domain = Category.Create({
            ...persist,
            subcategories:
                persist.subcategories ? persist.subcategories.map(f => SubcategoryMappers.PersistToDomain(f)) : [],
        }, persist.id);

        if (domain.isFailure)
            throw new Error(domain.unwrapError().message);

        return domain.unwrap();
    }


    public static DomainToPersist(domain: Category): Partial<CategoryPersistence> {
        return {
            id: domain._id.toString(),
            name: domain.name,
            description: domain.description,
            createdAt: domain.createdAt,
            updatedAt: domain.updatedAt,
            subcategories: domain.subcategoriesIds,
        };
    }

    public static DomainToDto(domain: Category): CategoryDto {
        return {
            id: domain._id.toString(),
            name: domain.name,
            description: domain.description,
            createdAt: domain.createdAt,
            updatedAt: domain.updatedAt,
        };
    }

    public static PaginatedToDto(pag: PaginatedFindResult<Category>): PaginatedFindResult<CategoryDto> {
        return {
            items: pag.items.length > 0 ? pag.items.map(CategoryMappers.DomainToDto) : [],
            limit: pag.limit,
            totalPages: pag.totalPages,
            currentPage: pag.currentPage,
        };
    }

    public static DomainToDetails(domain: Category): CategoryDetailsDto {
        let base = CategoryMappers.DomainToDto(domain);

        return {
            ...base,
            subcategories: domain.subcategories ? domain.subcategories.map(f => SubcategoryMappers.DomainToDto(f)) : [],
        };
    }
}
