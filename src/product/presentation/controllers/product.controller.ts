import {
    Body,
    Controller,
    Delete,
    Get,
    Logger,
    Param,
    Post,
    Put,
    Response,
    UploadedFile, UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {
    CreateProductUseCase,
    FindByIdProductUseCase,
    FindDetailsProductUseCase,
    PaginatedProductUseCase,
    RemoveProductUseCase,
    UpdateProductUseCase,
} from '../../application/useCases';
import {ProcessResponse} from '../../../shared/core/utils/processResponse';
import {Product} from '../../domain/entities/product.entity';
import {ProductPaginatedDto} from '../../application/dtos/product.paginated.dto';
import {ProductUpdateDto} from '../../application/dtos/product.update.dto';
import {ProductCreateDto} from '../../application/dtos/product.create.dto';
import {ProductMappers} from '../../infra/mappers/product.mappers';
import {FileInterceptor} from "@nestjs/platform-express";
import {Roles} from "../../../auth/application/guards/role";
import {Roles as Role} from "../../../shared/domain/enum.permits";
import {RolesGuard} from "../../../auth/application/guards/roleGuard";
import {JwtAuthGuard} from "../../../auth/application/guards/jwtAuthGuard";


@Controller('product')
export class ProductController {

    private _logger: Logger;

    constructor(
        private readonly findOneUseCase: FindByIdProductUseCase,
        private readonly createProductUseCase: CreateProductUseCase,
        private readonly updateProductUseCase: UpdateProductUseCase,
        private readonly removeProductUseCase: RemoveProductUseCase,
        private readonly paginatedProductUseCase: PaginatedProductUseCase,
        private readonly findDetailsProductUseCase: FindDetailsProductUseCase) {

        this._logger = new Logger('ProductController');
    }

    @Get(':id')
    async findOne(@Param() params, @Response() res) {
        this._logger.log('Find One');

        const teacher = await this.findOneUseCase.execute({id: params.id});
        return ProcessResponse.setResponse<Product>(res, teacher, ProductMappers.DomainToDto);
    }

    @Get('details/:id')
    async findDetails(@Param() params, @Response() res) {
        this._logger.log('Find One');

        const teacher = await this.findDetailsProductUseCase.execute({id: params.id});
        return ProcessResponse.setResponse<Product>(res, teacher, ProductMappers.DomainToDetails);
    }


    @Post()
    async getAllPaginated(@Body() body: ProductPaginatedDto, @Response() res) {
        this._logger.log('Paginated');
        console.log(body)
        const pag = await this.paginatedProductUseCase.execute(body);
        return ProcessResponse.setResponse(res, pag, ProductMappers.PaginatedToDto);
    }

    @Roles(Role.Admin)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Post('create')
    @UseInterceptors(FileInterceptor('file'))
    async create(@Body() body: ProductCreateDto, @UploadedFile() file: any, @Response() res) {
        this._logger.log('Create');
        const teacher = await this.createProductUseCase.execute({...body, file: file});
        return ProcessResponse.setResponse<Product>(res, teacher, ProductMappers.DomainToDto);
    }

    @Roles(Role.Admin)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Put()
    async update(@Body() body: ProductUpdateDto, @Response() res) {
        this._logger.log('Update');

        const teacher = await this.updateProductUseCase.execute(body);
        return ProcessResponse.setResponse<Product>(res, teacher, ProductMappers.DomainToDto);
    }

    @Roles(Role.Admin)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Delete()
    async delete(@Body() body: { id: string }, @Response() res) {
        this._logger.log('Delete');

        const teacher = await this.removeProductUseCase.execute(body);
        return ProcessResponse.setResponse<Product>(res, teacher, ProductMappers.DomainToDto);
    }
}
