import {Either, left, right} from '../../../shared/core/Either';
import {AppError} from '../../../shared/core/errors/AppError';
import {Result} from '../../../shared/core/Result';
import {Injectable, Logger} from '@nestjs/common';
import {IUseCase} from '../../../shared/core/interfaces/IUseCase';
import {ProductCreateDto} from '../dtos/product.create.dto';
import {Product} from "../../domain/entities/product.entity";
import {ProductRepository} from "../../infra/repositories/product.repository";
import {CreateFileUseCase} from "../../../file/application/useCases";
import {File} from "../../../file/domain/entities/file.entity";
import {TypeOrmUnitOfWork} from "../../../shared/modules/data-access/typeorm/unitwork.typeorm";
import Jimp from 'jimp/es';
import {AppConfigService} from "../../../shared/modules/config/service/app-config-service";
import {v4} from 'uuid'

export type CreateProductUseCaseResponse = Either<AppError.UnexpectedErrorResult<Product>
    | AppError.ValidationErrorResult<Product>, | AppError.ObjectNotExistResult<Product> |
    Result<Product>>;

@Injectable()
export class CreateProductUseCase implements IUseCase<ProductCreateDto, Promise<CreateProductUseCaseResponse>> {

    private _logger: Logger;

    constructor(
        private readonly configService: AppConfigService,
        private readonly typeOrmUnitOfWork: TypeOrmUnitOfWork,
        private readonly productRepository: ProductRepository,
        private readonly fileCreate: CreateFileUseCase
    ) {
        this._logger = new Logger('CreateTeacherUseCase');
    }

    async execute(request: ProductCreateDto): Promise<CreateProductUseCaseResponse> {
        await this.typeOrmUnitOfWork.start()

        const product: CreateProductUseCaseResponse = await this.typeOrmUnitOfWork.commit(async () => {
            return await this._execute(request);
        })

        return product
    }

    async _execute(request: ProductCreateDto): Promise<CreateProductUseCaseResponse> {
        this._logger.log('Executing...');
        console.log(request)

        const fileOrError = await this.fileCreate.execute({file: request.file})

        if (fileOrError.isLeft()) {
            return left(Result.Fail(new AppError.UnexpectedError(fileOrError.value.unwrapError())));
        }

        const file: File = fileOrError.value.unwrap()
        delete request.file
        const productOrError: Result<Product> = Product.New({...request, fileId: file._id.toString()});

        if (productOrError.isFailure)
            return left(productOrError);

        const product: Product = productOrError.unwrap();

        try {
            await this.productRepository.save(product);

            return right(Result.Ok(product));
        } catch (error) {
            return left(Result.Fail(new AppError.UnexpectedError(error)));
        }
    }
}
