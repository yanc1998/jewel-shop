import {Body, Controller, Get, Logger, Param, Post, Response, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from 'src/auth/application/guards/jwtAuthGuard';
import {ProcessResponse} from 'src/shared/core/utils/processResponse';
import {UserCreateDto} from '../application/dtos/user.create.dto';
import {UserUpdateDto} from '../application/dtos/user.update.dto';
import {CreateUserUseCase} from '../application/useCases/user.create.use-case';
import {UpdateUserUseCase} from '../application/useCases/user.update.use-case';
import {UserMapper} from '../infra/mappers/user.mappers';
import {PaginatedUserUseCase} from '../application/useCases/user.paginate.use-case';
import {UserPaginatedDto} from '../application/dtos/user.paginated.dto';
import {Roles} from "../../auth/application/guards/role";
import {Roles as Role} from "../../shared/domain/enum.permits";
import {RolesGuard} from "../../auth/application/guards/roleGuard";
import {FindByIdUserUseCase} from "../application/useCases/user.findById.use-case";
import {Product} from "../../product/domain/entities/product.entity";
import {ProductMappers} from "../../product/infra/mappers/product.mappers";
import {User} from "../domain/entities/user.entity";

//@UseGuards(RolesGuard)
@Controller('user')
export class UserController {
    private _logger: Logger;

    constructor(private readonly createUser: CreateUserUseCase,
                private readonly updateUser: UpdateUserUseCase,
                private readonly paginateUser: PaginatedUserUseCase,
                private readonly getUserById: FindByIdUserUseCase) {
        this._logger = new Logger('user')
    }


    @Roles(Role.Admin)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Post('create')
    async create(@Body() userCreateDto: UserCreateDto, @Response() res) {
        console.log(userCreateDto);
        const user = await this.createUser.execute(userCreateDto);
        return ProcessResponse.setResponse(res, user, UserMapper.DomainToDto);
    }

    @Roles(Role.Admin)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Post('update')
    async update(@Body() updateUserDto: UserUpdateDto, @Response() res) {
        console.log(updateUserDto);
        const user = await this.updateUser.execute(updateUserDto);
        return ProcessResponse.setResponse(res, user, UserMapper.DomainToDto);
    }

    @Roles(Role.Admin)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Post()
    async getAllPaginated(@Body() body: UserPaginatedDto, @Response() res) {
        //this._logger.log('Paginated');
        const pag = await this.paginateUser.execute(body);
        return ProcessResponse.setResponse(res, pag, UserMapper.PaginatedToDto);
    }

    @Roles(Role.Admin)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findOne(@Param() params, @Response() res) {
        this._logger.log('Find One');
        const user = await this.getUserById.execute({id: params.id});
        return ProcessResponse.setResponse<User>(res, user, UserMapper.DomainToDto);
    }

}
