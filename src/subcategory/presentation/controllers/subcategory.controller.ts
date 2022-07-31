import {Body, Controller, Delete, Get, Logger, Param, Post, Put, Response, UseGuards} from '@nestjs/common';
import {
    CreateSubcategoryUseCase,
    FindByIdSubcategoryUseCase,
    PaginatedTeacherUseCase,
    RemoveSubcategoryUseCase,
    UpdateTeacherUseCase,
} from '../../application/useCases';
import {ProcessResponse} from '../../../shared/core/utils/processResponse';
import {Subcategory} from '../../domain/entities/subcategory.entity';
import {SubcategoryPaginatedDto} from '../../application/dtos/subcategory.paginated.dto';
import {SubcategoryUpdateDto} from '../../application/dtos/subcategory.update.dto';
import {SubcategoryCreateDto} from '../../application/dtos/subcategory.create.dto';
import {SubcategoryMappers} from '../../infra/mappers/subcategoryMappers';
import {Roles} from "../../../auth/application/guards/role";
import {Roles as Role} from "../../../shared/domain/enum.permits";
import {RolesGuard} from "../../../auth/application/guards/roleGuard";
import {JwtAuthGuard} from "../../../auth/application/guards/jwtAuthGuard";

@Controller('subcategory')
export class SubcategoryController {

    private _logger: Logger;

    constructor(
        private readonly findOneUseCase: FindByIdSubcategoryUseCase,
        private readonly createTeacher: CreateSubcategoryUseCase,
        private readonly updateTeacher: UpdateTeacherUseCase,
        private readonly removeTeacher: RemoveSubcategoryUseCase,
        private readonly paginatedTeacher: PaginatedTeacherUseCase) {

        this._logger = new Logger('SubcategoryController');
    }

    @Get(':id')
    async findOne(@Param() params, @Response() res) {
        this._logger.log('Find One');

        const teacher = await this.findOneUseCase.execute({id: params.id});
        return ProcessResponse.setResponse<Subcategory>(res, teacher, SubcategoryMappers.DomainToDto);
    }


    @Post()
    async getAllPaginated(@Body() body: SubcategoryPaginatedDto, @Response() res) {
        this._logger.log('Paginated');

        const pag = await this.paginatedTeacher.execute(body);
        return ProcessResponse.setResponse(res, pag, SubcategoryMappers.PaginatedToDto);
    }

    @Roles(Role.Admin)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Post('create')
    async create(@Body() body: SubcategoryCreateDto, @Response() res) {

        this._logger.log('Create');

        const teacher = await this.createTeacher.execute(body);
        return ProcessResponse.setResponse<Subcategory>(res, teacher, SubcategoryMappers.DomainToDto);
    }

    @Roles(Role.Admin)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Put()
    async update(@Body() body: SubcategoryUpdateDto, @Response() res) {
        this._logger.log('Update');

        const teacher = await this.updateTeacher.execute(body);
        return ProcessResponse.setResponse<Subcategory>(res, teacher, SubcategoryMappers.DomainToDto);
    }

    @Roles(Role.Admin)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Delete()
    async delete(@Body() body: { id: string }, @Response() res) {
        this._logger.log('Delete');

        const teacher = await this.removeTeacher.execute(body);
        return ProcessResponse.setResponse<Subcategory>(res, teacher, SubcategoryMappers.DomainToDto);
    }
}
