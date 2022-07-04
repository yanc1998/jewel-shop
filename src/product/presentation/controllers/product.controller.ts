import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Response } from '@nestjs/common';
import {
  CreateProductUseCase,
  FindByIdProductUseCase,
  FindDetailsProductUseCase,
  PaginatedProductUseCase,
  RemoveProductUseCase,
  UpdateProductUseCase,
} from '../../application/useCases';
import { ProcessResponse } from '../../../shared/core/utils/processResponse';
import { Product } from '../../domain/entities/product.entity';
import { ProductPaginatedDto } from '../../application/dtos/product.paginated.dto';
import { ProductUpdateDto } from '../../application/dtos/product.update.dto';
import { ProductCreateDto } from '../../application/dtos/product.create.dto';
import { ProductMappers } from '../../infra/mappers/product.mappers';

@Controller('teacher')
export class ProductController {

  private _logger: Logger;

  constructor(
    private readonly findOneUseCase: FindByIdProductUseCase,
    private readonly createTeacher: CreateProductUseCase,
    private readonly updateTeacher: UpdateProductUseCase,
    private readonly removeTeacher: RemoveProductUseCase,
    private readonly paginatedTeacher: PaginatedProductUseCase,
    private readonly findDetailsTeacher: FindDetailsProductUseCase) {

    this._logger = new Logger('ProductController');
  }

  @Get(':id')
  async findOne(@Param() params, @Response() res) {
    this._logger.log('Find One');

    const teacher = await this.findOneUseCase.execute({ id: params.id });
    return ProcessResponse.setResponse<Product>(res, teacher, ProductMappers.DomainToDto);
  }

  @Get('details/:id')
  async findDetails(@Param() params, @Response() res) {
    this._logger.log('Find One');

    const teacher = await this.findDetailsTeacher.execute({ id: params.id });
    return ProcessResponse.setResponse<Product>(res, teacher, ProductMappers.DomainToDetails);
  }


  @Post()
  async getAllPaginated(@Body() body: ProductPaginatedDto, @Response() res) {
    this._logger.log('Paginated');

    const pag = await this.paginatedTeacher.execute(body);
    return ProcessResponse.setResponse(res, pag, ProductMappers.PaginatedToDto);
  }

  // @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() body: ProductCreateDto, @Response() res) {

    this._logger.log('Create');

    const teacher = await this.createTeacher.execute(body);
    return ProcessResponse.setResponse<Product>(res, teacher, ProductMappers.DomainToDto);
  }

  // @UseGuards(JwtAuthGuard)
  @Put()
  async update(@Body() body: ProductUpdateDto, @Response() res) {
    this._logger.log('Update');

    const teacher = await this.updateTeacher.execute(body);
    return ProcessResponse.setResponse<Product>(res, teacher, ProductMappers.DomainToDto);
  }

  // @UseGuards(JwtAuthGuard)
  @Delete()
  async delete(@Body() body: { id: string }, @Response() res) {
    this._logger.log('Delete');

    const teacher = await this.removeTeacher.execute(body);
    return ProcessResponse.setResponse<Product>(res, teacher, ProductMappers.DomainToDto);
  }
}
