import {FileDto} from './file.dto';
import {FileCreateDto} from "./file.create.dto";

export type FileUpdateDto = Partial<FileCreateDto> & {
    fileId: string
};
