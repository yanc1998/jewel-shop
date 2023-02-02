import {DomainBaseProps} from '../../../shared/domain/domain.base-props';
import {DomainTimestamp} from '../../../shared/domain/domain.timestamp';
import {DomainEntity} from '../../../shared/domain/entity.abstract';
import {Result} from '../../../shared/core/Result';
import {UniqueEntityID} from '../../../shared/domain/UniqueEntityID';
import {File} from "../../../file/domain/entities/file.entity";

type ProductProps = DomainBaseProps & DomainTimestamp & {
    price: number;
    file?: File;
    fileId: string;
    count: number;
    subcategoryId: string;
};

type newProductProps = Omit<ProductProps, 'id' | 'createdAt' | 'updatedAt' | 'file'>;

type updateProductProps = {
    fileId?: string
    subcategoryId?: string
    count?: number;
    price?: number;
    name?: string;
    description?: string;
}

// type updateProductProps = Omit<newProductProps, | 'fileId' | 'subcategoryId'> & {
//     fileId?: string
//     subcategoryId?: string
// };

export class Product extends DomainEntity<ProductProps> {

    get name(): string {
        return this.props.name;
    }

    get count(): number {
        return this.props.count
    }

    get description(): string {
        return this.props.description;
    }

    get subcategoryId(): string {
        return this.props.subcategoryId;
    }

    get fileId(): string {
        return this.props.fileId;
    }

    get file(): File {
        return this.props.file;
    }

    get price(): number {
        return this.props.price;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }

    public static New(props: newProductProps): Result<Product> {
        const ans: Result<Product> = this.Create({
            ...props,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        if (ans.isFailure) return Result.Fail(ans.unwrapError());

        return Result.Ok(ans.unwrap());
    }

    public static Create(props: ProductProps, id: string = null): Result<Product> {
        // set guards here
        return Result.Ok(new Product(props, new UniqueEntityID(id)));
    }

    public Update(props: updateProductProps) {
        this.props.description = props.description ?? this.props.description;
        this.props.name = props.name ?? this.props.name;
        this.props.count = props.count ?? this.props.count;
        this.props.price = props.price ?? this.props.price;
        this.props.fileId = props.fileId ?? this.props.fileId;
        this.props.subcategoryId = props.subcategoryId ?? this.props.subcategoryId;
        this.props.updatedAt = new Date();
        return Product.Create(this.props, this._id.toString())
        //Todo: change this
    }

}
