import {FileDto} from './file.dto';

export type FileCreateDto = Omit<FileDto, 'id' | 'createdAt' | 'updatedAt'> & {};
