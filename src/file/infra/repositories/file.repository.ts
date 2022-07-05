import {Injectable} from '@nestjs/common';
import {BaseRepository} from '../../../shared/modules/data-access/typeorm/base.respository';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {File} from '../../domain/entities/file.entity';
import {FilePersistence} from '../entities/file.persistence';
import {FileMappers} from '../mappers/file.mappers';
import {IFileRepository} from '../../domain/interfaces/IFileRepository';

@Injectable()
export class FileRepository extends BaseRepository<File, FilePersistence> implements IFileRepository {
    constructor(@InjectRepository(FilePersistence) _repository: Repository<FilePersistence>) {
        super(_repository, FileMappers.DomainToPersist, FileMappers.PersistToDomain, 'FileRepository');
    }

    async findDetails(id: string): Promise<File> {
        const file = await this
            ._entityRepository
            .findOne(id);
        return FileMappers.PersistToDomain(file);
    }
}
