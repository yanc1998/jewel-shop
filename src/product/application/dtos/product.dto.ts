import {PropsBaseDto} from '../../../shared/core/PropsBaseDto';
import {BaseDto} from '../../../shared/core/BaseDto';
import {FileDto} from "../../../file/application/dtos/file.dto";

export type ProductDto = PropsBaseDto & BaseDto & {
    price: number;
    count: number;
    file?: FileDto;
    subcategoryId: string;
}
