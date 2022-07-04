import { IRepository } from '../../../shared/core/interfaces/IRepository';
import { User } from '../entities/user.entity';

export interface IUserRepository extends IRepository<User> {
};