import {Either, left, right} from '../../../shared/core/Either';
import {AppError} from '../../../shared/core/errors/AppError';
import {Result} from '../../../shared/core/Result';
import {Injectable, Logger} from '@nestjs/common';
import {IUseCase} from '../../../shared/core/interfaces/IUseCase';
import {ProductCreateDto} from '../dtos/product.create.dto';
import {Product} from "../../domain/entities/product.entity";
import {ProductRepository} from "../../infra/repositories/product.repository";


export type CreateProductUseCaseResponse = Either<AppError.UnexpectedErrorResult<Product>
    | AppError.ValidationErrorResult<Product>,
    Result<Product>>;

@Injectable()
export class CreateProductUseCase implements IUseCase<ProductCreateDto, Promise<CreateProductUseCaseResponse>> {

    private _logger: Logger;

    constructor(
        private readonly productRepository: ProductRepository,
    ) {
        this._logger = new Logger('CreateTeacherUseCase');
    }

    async execute(request: ProductCreateDto): Promise<CreateProductUseCaseResponse> {
        this._logger.log('Executing...');

        const teacherOrError: Result<Product> = Product.New({...request});

        if (teacherOrError.isFailure)
            return left(teacherOrError);

        const product: Product = teacherOrError.unwrap();

        try {
            await this.productRepository.save(product);

            return right(Result.Ok(product));
        } catch (error) {
            return left(Result.Fail(new AppError.UnexpectedError(error)));
        }
    }
}
