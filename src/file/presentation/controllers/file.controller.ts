import {Body, Controller, Delete, Get, Logger, Param, Post, Put, Response} from '@nestjs/common';
import {
    CreateFileUseCase,
    FindByIdFileUseCase,
    PaginatedFileUseCase,
    RemoveFileUseCase,
    UpdateFileUseCase,
} from '../../application/useCases';
import {ProcessResponse} from '../../../shared/core/utils/processResponse';
import {File} from '../../domain/entities/file.entity';
import {FilePaginatedDto} from '../../application/dtos/file.paginated.dto';
import {FileUpdateDto} from '../../application/dtos/file.update.dto';
import {FileCreateDto} from '../../application/dtos/file.create.dto';
import {FileMappers} from '../../infra/mappers/file.mappers';

@Controller('file')
export class FileController {

    private _logger: Logger;

    constructor(
        private readonly findOneUseCase: FindByIdFileUseCase,
        private readonly createFileUseCase: CreateFileUseCase,
        private readonly updateFileUseCase: UpdateFileUseCase,
        private readonly removeFileUseCase: RemoveFileUseCase,
        private readonly paginatedFileUseCase: PaginatedFileUseCase) {

        this._logger = new Logger('FileController');
    }

    @Get(':id')
    async findOne(@Param() params, @Response() res) {
        this._logger.log('Find One');

        const teacher = await this.findOneUseCase.execute({id: params.id});
        return ProcessResponse.setResponse<File>(res, teacher, FileMappers.DomainToDto);
    }

    @Post()
    async getAllPaginated(@Body() body: FilePaginatedDto, @Response() res) {
        this._logger.log('Paginated');

        const pag = await this.paginatedFileUseCase.execute(body);
        return ProcessResponse.setResponse(res, pag, FileMappers.PaginatedToDto);
    }

    // @UseGuards(JwtAuthGuard)
    @Post('create')
    async create(@Body() body: FileCreateDto, @Response() res) {

        this._logger.log('Create');

        const teacher = await this.createFileUseCase.execute(body);
        return ProcessResponse.setResponse<File>(res, teacher, FileMappers.DomainToDto);
    }

    // @UseGuards(JwtAuthGuard)
    @Put()
    async update(@Body() body: FileUpdateDto, @Response() res) {
        this._logger.log('Update');

        const teacher = await this.updateFileUseCase.execute(body);
        return ProcessResponse.setResponse<File>(res, teacher, FileMappers.DomainToDto);
    }

    // @UseGuards(JwtAuthGuard)
    @Delete()
    async delete(@Body() body: { id: string }, @Response() res) {
        this._logger.log('Delete');

        const teacher = await this.removeFileUseCase.execute(body);
        return ProcessResponse.setResponse<File>(res, teacher, FileMappers.DomainToDto);
    }
}
