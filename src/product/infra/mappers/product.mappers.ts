import {ProductPersistence} from '../entities/product.persistence';
import {Product} from '../../domain/entities/product.entity';
import {PaginatedFindResult} from '../../../shared/core/PaginatedFindResult';
import {ProductDto} from '../../application/dtos/product.dto';
import {ProductDetailsDto} from '../../application/dtos/product.details.dto';

export class ProductMappers {
    public static PersistToDomain(persist: ProductPersistence): Product {
        const domain = Product.Create({
            ...persist
        }, persist.id);

        if (domain.isFailure)
            throw new Error(domain.unwrapError().message);

        return domain.unwrap();
    }


    public static DomainToPersist(domain: Product): Partial<ProductPersistence> {
        return {
            id: domain._id.toString(),
            name: domain.name,
            description: domain.description,
            price: domain.price,
            createdAt: domain.createdAt,
            updatedAt: domain.updatedAt,
        };
    }

    public static DomainToDto(domain: Product): ProductDto {
        return {
            id: domain._id.toString(),
            name: domain.name,
            description: domain.description,
            price: domain.price,
            fileId: domain.fileId,
            createdAt: domain.createdAt,
            updatedAt: domain.updatedAt,
        };
    }

    public static PaginatedToDto(pag: PaginatedFindResult<Product>): PaginatedFindResult<ProductDto> {
        return {
            items: pag.items.length > 0 ? pag.items.map(ProductMappers.DomainToDto) : [],
            limit: pag.limit,
            totalPages: pag.totalPages,
            currentPage: pag.currentPage,
        };
    }

    public static DomainToDetails(domain: Product): ProductDetailsDto {
        let base = ProductMappers.DomainToDto(domain);
        return {
            ...base,
        };
    }
}
