import { EnumPermits } from 'src/shared/domain/enum.permits';
import { BaseDto } from '../../../shared/core/BaseDto';
import { UserStatus } from '../../domain/enums/user.status';

export type UserDto = BaseDto & {
  username: string;
  roles: EnumPermits[];
  email: string;
  status: UserStatus;
}