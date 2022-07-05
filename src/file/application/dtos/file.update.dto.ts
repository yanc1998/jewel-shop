import {FileDto} from './file.dto';

export type FileUpdateDto = Omit<Partial<FileDto>, 'id'> & {
    fileId: string
};
