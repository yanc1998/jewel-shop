import {IRepository} from '../../../shared/core/interfaces/IRepository';
import {File} from '../entities/file.entity';

export interface IFileRepository extends IRepository<File> {
    findDetails(id: string): Promise<File>;
};
