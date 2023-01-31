import {DomainBaseProps} from '../../../shared/domain/domain.base-props';
import {DomainTimestamp} from '../../../shared/domain/domain.timestamp';
import {DomainEntity} from '../../../shared/domain/entity.abstract';
import {Result} from '../../../shared/core/Result';
import {UniqueEntityID} from '../../../shared/domain/UniqueEntityID';
import {resizeFile} from "../../application/utils/resize-file";
import {removeFile} from "../../application/utils/remove-file";
import {AppError} from "../../../shared/core/errors/AppError";

type FileProps = DomainTimestamp & {
    url: string;
};

type newFileProps = {
    file: any,
    fileDir: string
};

type updateFileProps = newFileProps

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

    public static async New(props: newFileProps): Promise<Result<File>> {

        //save and resize file

        const file_nameOrError = await resizeFile(props.file, props.fileDir)

        if (file_nameOrError.isFailure) {
            return Result.Fail(file_nameOrError.unwrapError())
        }
        const file_name = file_nameOrError.unwrap()

        const ans: Result<File> = this.Create({
            url: file_name,
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

    public async Update(props: updateFileProps) {
        if (props.file) {
            removeFile(this.props.url, props.fileDir)
            const file_nameOrError = await resizeFile(props.file, props.fileDir)
            if (file_nameOrError.isFailure) {
                return Result.Fail<File>(new AppError.UnexpectedError(file_nameOrError.unwrapError()))
            }
            const file_name = file_nameOrError.unwrap()
            this.props.url = file_name
            this.props.updatedAt = new Date()
            return File.Create(this.props, this._id.toString())
        }
        return Result.Ok(this)
    }

}
