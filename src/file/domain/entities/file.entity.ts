import {DomainBaseProps} from '../../../shared/domain/domain.base-props';
import {DomainTimestamp} from '../../../shared/domain/domain.timestamp';
import {DomainEntity} from '../../../shared/domain/entity.abstract';
import {Result} from '../../../shared/core/Result';
import {UniqueEntityID} from '../../../shared/domain/UniqueEntityID';

type FileProps = DomainTimestamp & {
    url: string;
};

type newProductProps = Omit<FileProps, 'id' | 'createdAt' | 'updatedAt'>;

export class File extends DomainEntity<FileProps> {

    get url(): string {
        return this.props.url;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }

    public static New(props: newProductProps): Result<File> {
        const ans: Result<File> = this.Create({
            ...props,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        if (ans.isFailure) return Result.Fail(ans.unwrapError());

        return Result.Ok(ans.unwrap());
    }

    public static Create(props: FileProps, id: string = null): Result<File> {
        // set guards here
        return Result.Ok(new File(props, new UniqueEntityID(id)));
    }

    public Update(props: any) {
        this.props.url = props.url ?? this.props.url;
        this.props.updatedAt = new Date();
    }

}
