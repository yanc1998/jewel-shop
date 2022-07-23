import {Validation_codePersistence} from '../entities/validation_code.persistence';
import {ValidationCode} from '../../domain/entities/validation_code.entity';
import {PaginatedFindResult} from '../../../shared/core/PaginatedFindResult';
import {ValidationCodeDto} from '../../application/dtos/validationCode.dto';
import {ValidationCodeDetailsDto} from '../../application/dtos/validationCode.details.dto';

export class ValidationCodeMappers {
    public static PersistToDomain(persist: Validation_codePersistence): ValidationCode {
        const domain = ValidationCode.Create({
            ...persist
        }, persist.id);

        if (domain.isFailure)
            throw new Error(domain.unwrapError().message);

        return domain.unwrap();
    }


    public static DomainToPersist(domain: ValidationCode): Partial<Validation_codePersistence> {
        return {
            id: domain._id.toString(),
            code: domain.code,
            userId: domain.userId,
            createdAt: domain.createdAt,
            updatedAt: domain.updatedAt,
        };
    }

    public static DomainToDto(domain: ValidationCode): ValidationCodeDto {
        return {
            id: domain._id.toString(),
            code: domain.code,
            userId: domain.userId,
            createdAt: domain.createdAt,
            updatedAt: domain.updatedAt,
        };
    }

    public static PaginatedToDto(pag: PaginatedFindResult<ValidationCode>): PaginatedFindResult<ValidationCodeDto> {
        return {
            items: pag.items.length > 0 ? pag.items.map(ValidationCodeMappers.DomainToDto) : [],
            limit: pag.limit,
            totalPages: pag.totalPages,
            currentPage: pag.currentPage,
        };
    }

    public static DomainToDetails(domain: ValidationCode): ValidationCodeDetailsDto {
        let base = ValidationCodeMappers.DomainToDto(domain);
        return {
            ...base,
        };
    }
}
