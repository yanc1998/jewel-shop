import {ProductPersistence} from '../entities/product.persistence';
import {Product} from '../../domain/entities/product.entity';
import {PaginatedFindResult} from '../../../shared/core/PaginatedFindResult';
import {ProductDto} from '../../application/dtos/product.dto';
import {ProductDetailsDto} from '../../application/dtos/product.details.dto';
import {FileMappers} from "../../../file/infra/mappers/file.mappers";

export class ProductMappers {
    public static PersistToDomain(persist: ProductPersistence): Product {
        if (persist.file) {
            persist.file = FileMappers.PersistToDomain(persist.file)
        }
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
            count: domain.count,
            description: domain.description,
            price: domain.price,
            subcategoryId: domain.subcategoryId,
            fileId: domain.fileId,
            createdAt: domain.createdAt,
            updatedAt: domain.updatedAt,
        };
    }

    public static DomainToDto(domain: Product): ProductDto {
        const dto = {
            id: domain._id.toString(),
            name: domain.name,
            description: domain.description,
            price: domain.price,
            count: domain.count,
            subcategoryId: domain.subcategoryId,

            createdAt: domain.createdAt,
            updatedAt: domain.updatedAt,
        }
        if (domain.file) {
            dto['file'] = FileMappers.DomainToDto(domain.file)
        }
        return dto
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
