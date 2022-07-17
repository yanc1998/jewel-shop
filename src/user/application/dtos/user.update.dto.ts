import {EnumPermits, Roles} from 'src/shared/domain/enum.permits';
import { UserStatus } from 'src/user/domain/enums/user.status';

export type UserUpdateDto = {
    id: string
    data: {
        username?: string;
        roles?: Roles[]
        password?: string
        status?: UserStatus
    }
}
