import {DomainTimestamp} from '../../../shared/domain/domain.timestamp';
import {DomainEntity} from '../../../shared/domain/entity.abstract';
import {Result} from '../../../shared/core/Result';
import {UniqueEntityID} from '../../../shared/domain/UniqueEntityID';

type ValidationCodeProps = DomainTimestamp & {
    code: string;
    userId: string;
};

type newProductProps = Omit<ValidationCodeProps, 'id' | 'createdAt' | 'updatedAt'>;

export class ValidationCode extends DomainEntity<ValidationCodeProps> {

    get code(): string {
        return this.props.code;
    }

    get userId(): string {
        return this.props.userId;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }

    public static New(props: newProductProps): Result<ValidationCode> {
        const ans: Result<ValidationCode> = this.Create({
            ...props,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        if (ans.isFailure) return Result.Fail(ans.unwrapError());

        return Result.Ok(ans.unwrap());
    }

    public static Create(props: ValidationCodeProps, id: string = null): Result<ValidationCode> {
        // set guards here
        return Result.Ok(new ValidationCode(props, new UniqueEntityID(id)));
    }

    public Update(props: any) {
        this.props.code = props.code ?? this.props.code;
        this.props.updatedAt = new Date();
    }

}
