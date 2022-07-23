import {PropsBaseDto} from '../../../shared/core/PropsBaseDto';
import {BaseDto} from '../../../shared/core/BaseDto';

export type ValidationCodeDto = BaseDto & {
    code: string;
    userId: string;
}
