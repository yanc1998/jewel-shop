import { EnumPermits } from 'src/shared/domain/enum.permits';
import { UserStatus } from 'src/user/domain/enums/user.status';

export type UserUpdateDto = {
    id: string
    data: {
        username?: string;
        roles?: EnumPermits[]
        password?: string
        status?: UserStatus
    }
}