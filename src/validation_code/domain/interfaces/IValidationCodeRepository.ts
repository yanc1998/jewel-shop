import {IRepository} from '../../../shared/core/interfaces/IRepository';
import {ValidationCode} from '../entities/validation_code.entity';

export interface IValidationCodeRepository extends IRepository<ValidationCode> {
    findDetails(id: string): Promise<ValidationCode>;
};
