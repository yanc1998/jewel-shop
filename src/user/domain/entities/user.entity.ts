import {DomainEntity} from '../../../shared/domain/entity.abstract';
import {Result} from '../../../shared/core/Result';
import {EnumPermits, Roles} from 'src/shared/domain/enum.permits';
import {Guard} from 'src/shared/core/Guard';
import {AppError} from 'src/shared/core/errors/AppError';
import {UserStatus} from '../enums/user.status';
import {hashSync} from 'bcrypt';
import {UniqueEntityID} from '../../../shared/domain/UniqueEntityID';

type UserProps = {
    username: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    password: string;
    status: UserStatus;
    roles: Roles[];
};


type newUserProps = Omit<UserProps, | 'id' | 'createdAt' | 'updatedAt'>;


type updateUserProps = {
    username?: string;
    password?: string;
    status?: UserStatus;
    roles?: Roles[];
};


export class User extends DomainEntity<UserProps> {

    get username(): string {
        return this.props.username;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }

    get email(): string {
        return this.props.email;
    }

    get password(): string {
        return this.props.password;
    }

    get roles(): Roles[] {
        return this.props.roles;
    }

    get status(): UserStatus {
        return this.props.status;
    }

    public static New(props: newUserProps): Result<User> {
        const ans: Result<User> = this.Create({
            ...props,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        if (ans.isFailure) return Result.Fail(ans.unwrapError());

        return Result.Ok(ans.unwrap());
    }

    public static Create(props: UserProps, id: string = null): Result<User> {
        // set guards here
        console.log(props)
        const shortNameOrError = Guard.againstAtLeast({
            argumentPath: 'shortname',
            numChars: 3,
            argument: props.username
        });
        if (!shortNameOrError.succeeded) {
            return Result.Fail(new AppError.ValidationError(shortNameOrError.message));
        }


        const passwordOrError = Guard.againstAtLeast({argumentPath: 'password', numChars: 5, argument: props.password});
        if (!passwordOrError.succeeded) {
            return Result.Fail(new AppError.ValidationError(passwordOrError.message));
        }

        return Result.Ok(new User(props, new UniqueEntityID(id)));
    }

    public setPasswordHash(password: string) {
        if (password) {
            this.props.password = hashSync(password, 5);
        }
    }

    public Update(props: updateUserProps) {
        console.log(props,'props')
        this.props.username = props.username ?? this.props.username;
        this.props.password = props.password ?? this.props.password;
        this.props.status = props.status ?? this.props.status;
        this.props.roles = props.roles ?? this.props.roles;
        this.props.updatedAt = new Date();
        console.log('pass')
        // this.props.name = props.name ?? this.props.name;
    }
}
