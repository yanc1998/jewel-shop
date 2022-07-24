import {ValidationCodeDto} from './validationCode.dto';

export type ValidationCodeCreateDto =
    Omit<ValidationCodeDto, 'id' | 'createdAt' | 'updatedAt' >
    & {};
