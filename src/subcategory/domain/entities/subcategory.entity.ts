import {DomainBaseProps} from '../../../shared/domain/domain.base-props';
import {DomainTimestamp} from '../../../shared/domain/domain.timestamp';
import {DomainEntity} from '../../../shared/domain/entity.abstract';
import {Result} from '../../../shared/core/Result';
import {UniqueEntityID} from '../../../shared/domain/UniqueEntityID';
import {Product} from "../../../product/domain/entities/product.entity";

type SubcategoryProps = DomainBaseProps & DomainTimestamp & {
    productsIds?: { id: string }[];
    products?: Product[];
    categoryId: string;
};

type newSubcategoryProps = Omit<SubcategoryProps, 'id' | 'createdAt' | 'updatedAt'>;

export class Subcategory extends DomainEntity<SubcategoryProps> {

    get productsIds(): { id: string }[] {
        return this.props.productsIds;
    }

    get categoryId(): string {
        return this.props.categoryId
    }

    get products(): Product[] {
        return this.props.products;
    }

    get name(): string {
        return this.props.name;
    }

    get description(): string {
        return this.props.description;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }

    public SetProducts(products: { id: string }[]): void {

        if (!products) return;

        this.props.productsIds = products;
    }

    public static New(props: newSubcategoryProps): Result<Subcategory> {
        const ans: Result<Subcategory> = this.Create({
            ...props,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        if (ans.isFailure) return Result.Fail(ans.unwrapError());

        return Result.Ok(ans.unwrap());
    }

    public static Create(props: SubcategoryProps, id: string = null): Result<Subcategory> {
        // set guards here
        return Result.Ok(new Subcategory(props, new UniqueEntityID(id)));
    }

    public Update(props: any) {
        this.props.description = props.description ?? this.props.description;
        this.props.name = props.fullName ?? this.props.name;
        this.SetProducts(props.productsIds);
        this.props.updatedAt = new Date();
    }

}
