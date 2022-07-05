import {PropsBaseDto} from '../../../shared/core/PropsBaseDto';
import {BaseDto} from '../../../shared/core/BaseDto';

export type ProductDto = PropsBaseDto & BaseDto & {
    price: number;
    fileId: string;
}
