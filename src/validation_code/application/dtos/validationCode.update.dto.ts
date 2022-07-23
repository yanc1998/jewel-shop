import {ValidationCodeDto} from './validationCode.dto';

export type ValidationCodeUpdateDto = Omit<Partial<ValidationCodeDto>, 'id'> & {
};
