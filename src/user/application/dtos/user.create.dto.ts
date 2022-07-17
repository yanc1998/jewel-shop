import {EnumPermits, Roles} from 'src/shared/domain/enum.permits';
import { UserStatus } from 'src/user/domain/enums/user.status';

export type UserCreateDto = {
    username: string;
    roles: Roles[]
    password: string
    email: string
    status: UserStatus
}
