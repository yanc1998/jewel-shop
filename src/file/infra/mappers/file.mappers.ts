import {FilePersistence} from '../entities/file.persistence';
import {File} from '../../domain/entities/file.entity';
import {PaginatedFindResult} from '../../../shared/core/PaginatedFindResult';
import {FileDto} from '../../application/dtos/file.dto';
import {FileDetailsDto} from '../../application/dtos/file.details.dto';

export class FileMappers {
    public static PersistToDomain(persist: FilePersistence): File {
        const domain = File.Create({
            ...persist
        }, persist.id);

        if (domain.isFailure)
            throw new Error(domain.unwrapError().message);

        return domain.unwrap();
    }


    public static DomainToPersist(domain: File): Partial<FilePersistence> {
        return {
            id: domain._id.toString(),
            url: domain.url,
            createdAt: domain.createdAt,
            updatedAt: domain.updatedAt,
        };
    }

    public static DomainToDto(domain: File): FileDto {
        return {
            id: domain._id.toString(),
            url: domain.url,
            createdAt: domain.createdAt,
            updatedAt: domain.updatedAt,
        };
    }

    public static PaginatedToDto(pag: PaginatedFindResult<File>): PaginatedFindResult<FileDto> {
        return {
            items: pag.items.length > 0 ? pag.items.map(FileMappers.DomainToDto) : [],
            limit: pag.limit,
            totalPages: pag.totalPages,
            currentPage: pag.currentPage,
        };
    }

    public static DomainToDetails(domain: File): FileDetailsDto {
        let base = FileMappers.DomainToDto(domain);
        return {
            ...base,
        };
    }
}
