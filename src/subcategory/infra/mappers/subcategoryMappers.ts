import {SubcategoryPersistence} from '../entities/subcategory.persistence';
import {Subcategory} from '../../domain/entities/subcategory.entity';
import {PaginatedFindResult} from '../../../shared/core/PaginatedFindResult';
import {SubcategoryDto} from '../../application/dtos/subcategory.dto';
import {SubcategoryDetailsDto} from '../../application/dtos/subcategory.details.dto';
import {ProductMappers} from "../../../product/infra/mappers/product.mappers";

export class SubcategoryMappers {
    public static PersistToDomain(persist: SubcategoryPersistence): Subcategory {
        const domain = Subcategory.Create({
            ...persist,
            products:
                persist.products ? persist.products.map(p => ProductMappers.PersistToDomain(p)) : [],
        }, persist.id);

        if (domain.isFailure)
            throw new Error(domain.unwrapError().message);

        return domain.unwrap();
    }


    public static DomainToPersist(domain: Subcategory): Partial<SubcategoryPersistence> {
        return {
            id: domain._id.toString(),
            name: domain.name,
            description: domain.description,
            createdAt: domain.createdAt,
            updatedAt: domain.updatedAt,
            products: domain.productsIds,
            categoryId: domain.categoryId
        };
    }

    public static DomainToDto(domain: Subcategory): SubcategoryDto {
        return {
            id: domain._id.toString(),
            name: domain.name,
            description: domain.description,
            categoryId:domain.categoryId,
            createdAt: domain.createdAt,
            updatedAt: domain.updatedAt,
        };
    }

    public static PaginatedToDto(pag: PaginatedFindResult<Subcategory>): PaginatedFindResult<SubcategoryDto> {
        return {
            items: pag.items.length > 0 ? pag.items.map(SubcategoryMappers.DomainToDto) : [],
            limit: pag.limit,
            totalPages: pag.totalPages,
            currentPage: pag.currentPage,
        };
    }

    public static DomainToDetails(domain: Subcategory): SubcategoryDetailsDto {
        let base = SubcategoryMappers.DomainToDto(domain);

        return {
            ...base,
            products: domain.products ? domain.products.map(f => ProductMappers.DomainToDto(f)) : [],
        };
    }
}
