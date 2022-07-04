import { EnumPermits } from 'src/shared/domain/enum.permits';
import { UserStatus } from 'src/user/domain/enums/user.status';

export type UserCreateDto = {
    username: string;
    roles: EnumPermits[]
    password: string
    email: string
    status: UserStatus
}