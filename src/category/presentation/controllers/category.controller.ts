import {Body, Controller, Delete, Get, Logger, Param, Post, Put, Response, UseGuards} from '@nestjs/common';
import {
    CreateCategoryUseCase,
    FindByIdCategoryUseCase,
    PaginatedCategoryUseCase,
    RemoveCategoryUseCase,
    UpdateTeacherUseCase,
} from '../../application/useCases';
import {ProcessResponse} from '../../../shared/core/utils/processResponse';
import {Category} from '../../domain/entities/category.entity';
import {CategoryPaginatedDto} from '../../application/dtos/category.paginated.dto';
import {CategoryUpdateDto} from '../../application/dtos/category.update.dto';
import {CategoryCreateDto} from '../../application/dtos/category.create.dto';
import {CategoryMappers} from '../../infra/mappers/category.mappers';
import {JwtAuthGuard} from "../../../auth/application/guards/jwtAuthGuard";
import {RolesGuard} from "../../../auth/application/guards/roleGuard";
import {Roles as Role} from "../../../shared/domain/enum.permits";

import {Roles} from "../../../auth/application/guards/role";
import {TypeOrmUnitOfWork} from "../../../shared/modules/data-access/typeorm/unitwork.typeorm";


@Controller('category')
export class CategoryController {

    private _logger: Logger;

    constructor(
        private readonly typeOrmUnitOfWork: TypeOrmUnitOfWork,
        private readonly findOneUseCase: FindByIdCategoryUseCase,
        private readonly createTeacher: CreateCategoryUseCase,
        private readonly updateTeacher: UpdateTeacherUseCase,
        private readonly removeTeacher: RemoveCategoryUseCase,
        private readonly paginatedTeacher: PaginatedCategoryUseCase) {

        this._logger = new Logger('CategoryController');
    }

    @Get(':id')
    async findOne(@Param() params, @Response() res) {
        this._logger.log('Find One');
        const teacher = await this.findOneUseCase.execute({id: params.id});
        return ProcessResponse.setResponse<Category>(res, teacher, CategoryMappers.DomainToDto);
    }


    @Post()
    async getAllPaginated(@Body() body: CategoryPaginatedDto, @Response() res) {
        this._logger.log('Paginated');

        const pag = await this.paginatedTeacher.execute(body);
        return ProcessResponse.setResponse(res, pag, CategoryMappers.PaginatedToDto);
    }

    @Roles(Role.Admin)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Post('create')
    async create(@Body() body: CategoryCreateDto, @Response() res) {

        this._logger.log('Create');

        const teacher = await this.createTeacher.execute(body);
        return ProcessResponse.setResponse<Category>(res, teacher, CategoryMappers.DomainToDto);
    }

    @Roles(Role.Admin)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Put()
    async update(@Body() body: CategoryUpdateDto, @Response() res) {
        this._logger.log('Update');

        const teacher = await this.updateTeacher.execute(body);
        return ProcessResponse.setResponse<Category>(res, teacher, CategoryMappers.DomainToDto);
    }

    @Roles(Role.Admin)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Delete()
    async delete(@Body() body: { id: string }, @Response() res) {
        this._logger.log('Delete');

        const teacher = await this.removeTeacher.execute(body);
        return ProcessResponse.setResponse<Category>(res, teacher, CategoryMappers.DomainToDto);
    }
}
