import {Injectable} from '@nestjs/common';
import {BaseRepository} from '../../../shared/modules/data-access/typeorm/base.respository';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {ValidationCode} from '../../domain/entities/validation_code.entity';
import {Validation_codePersistence} from '../entities/validation_code.persistence';
import {ValidationCodeMappers} from '../mappers/validation-code.mappers';
import {IValidationCodeRepository} from '../../domain/interfaces/IValidationCodeRepository';

@Injectable()
export class ValidateCodeRepository extends BaseRepository<ValidationCode, Validation_codePersistence> implements IValidationCodeRepository {
    constructor(@InjectRepository(Validation_codePersistence) _repository: Repository<Validation_codePersistence>) {
        super(_repository, ValidationCodeMappers.DomainToPersist, ValidationCodeMappers.PersistToDomain, 'ValidateCodeRepository');
    }

    async findDetails(id: string): Promise<ValidationCode> {
        const file = await this
            ._entityRepository
            .findOne(id);
        return ValidationCodeMappers.PersistToDomain(file);
    }
}
