import {Either, left, right} from '../../../shared/core/Either';
import {AppError} from '../../../shared/core/errors/AppError';
import {Result} from '../../../shared/core/Result';
import {Injectable, Logger} from '@nestjs/common';
import {IUseCase} from '../../../shared/core/interfaces/IUseCase';
import Optional from '../../../shared/core/Option';
import {Product} from "../../domain/entities/product.entity";
import {ProductUpdateDto} from "../dtos/product.update.dto";
import {ProductRepository} from "../../infra/repositories/product.repository";

export type UpdateProductUseCaseResponse =
    Either<AppError.UnexpectedErrorResult<Product>
        | AppError.ValidationErrorResult<Product>
        | AppError.ObjectNotExistResult<Product>,
        Result<Product>>;

@Injectable()
export class UpdateProductUseCase implements IUseCase<ProductUpdateDto, Promise<UpdateProductUseCaseResponse>> {

    private _logger: Logger;

    constructor(private readonly productRepository: ProductRepository) {
        this._logger = new Logger('UpdateTeacherUseCase');
    }

    async execute(request: ProductUpdateDto): Promise<UpdateProductUseCaseResponse> {
        this._logger.log('Executing');

        const toUpdate = Optional(await this.productRepository.findById(request.productId));
        if (toUpdate.isNone())
            return left(Result.Fail(new AppError.ObjectNotExist(`Teacher with id ${request.productId} doesn't exist`)));

        let forUpdate: Product = toUpdate.unwrap();
        forUpdate.Update(request);

        try {
            await this.productRepository.save(forUpdate);
            return right(Result.Ok(forUpdate));
        } catch (error) {
            return left(Result.Fail(new AppError.UnexpectedError(error)));
        }
    }
}
