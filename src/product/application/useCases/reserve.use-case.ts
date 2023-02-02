import {Either, left, right} from '../../../shared/core/Either';
import {AppError} from '../../../shared/core/errors/AppError';
import {Result} from '../../../shared/core/Result';
import {Injectable, Logger} from '@nestjs/common';
import {IUseCase} from '../../../shared/core/interfaces/IUseCase';
import Optional from '../../../shared/core/Option';
import {Product} from "../../domain/entities/product.entity";
import {ProductRepository} from "../../infra/repositories/product.repository";
import {TypeOrmUnitOfWork} from "../../../shared/modules/data-access/typeorm/unitwork.typeorm";
import {SendEmailUseCase} from "../../../email/application/useCases/email.send.use-case";
import {AppConfigService} from "../../../shared/modules/config/service/app-config-service";
import {User} from "../../../user/domain/entities/user.entity";

export type ReserveProductUseCaseResponse =
    Either<AppError.UnexpectedErrorResult<Product>
        | AppError.ValidationErrorResult<Product>
        | AppError.ObjectNotExistResult<Product>,
        Result<Product>>;

@Injectable()
export class ReserveProductUseCase implements IUseCase<{ id: string }, Promise<ReserveProductUseCaseResponse>> {

    private _logger: Logger;

    constructor(private readonly productRepository: ProductRepository,
                private readonly configService: AppConfigService,
                private readonly typeOrmUnitOfWork: TypeOrmUnitOfWork,
                private readonly sendEmailUseCase: SendEmailUseCase) {
        this._logger = new Logger('ReserveProductUseCase');
    }

    async execute(request: { id: string, user: User }): Promise<ReserveProductUseCaseResponse> {
        await this.typeOrmUnitOfWork.start()

        const product: ReserveProductUseCaseResponse = await this.typeOrmUnitOfWork.commit(async () => {
            return await this._execute(request);
        })

        return product
    }

    async _execute(request: { id: string, user: User }): Promise<ReserveProductUseCaseResponse> {
        const productOptional = Optional(await this.productRepository.findById(request.id));

        if (productOptional.isNone())
            return left(Result.Fail(new AppError.ObjectNotExist(`Product with id ${request.id} doesn't exist`)));

        try {
            const product = productOptional.unwrap()

            await this.sendEmailUseCase.execute({
                to: this.configService.smtp.email,
                body: {
                    message: `<p>solicitud de reserva para el tour ${product.name} \n 
                    por el usuario de nombre:${request.user.username} \n 
                    y correo:${request.user.email}</p> `,
                    data: null
                }
            })

            await this.sendEmailUseCase.execute({
                to: request.user.email,
                body: {
                    message: `<p>Your reservation request was completed satisfactorily,the administrator\n
                     will contact you, thank you very much for using our services</p>`,
                    data: null
                }
            })

            //TODO:uncoment this when discount

            // const newCount: number = product.count - 1
            // const updatedProductOrError = product.Update({count: newCount})
            // const updatedProduct = updatedProductOrError.unwrap()
            // await this.productRepository.update(updatedProduct, product._id.toString())


            return right(Result.Ok(product));
        } catch (error) {
            return left(Result.Fail(new AppError.UnexpectedError(error)));
        }
    }
}
