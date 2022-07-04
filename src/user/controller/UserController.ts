import { Body, Controller, Post, Response, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/application/guards/jwtAuthGuard';
import { ProcessResponse } from 'src/shared/core/utils/processResponse';
import { UserCreateDto } from '../application/dtos/user.create.dto';
import { UserUpdateDto } from '../application/dtos/user.update.dto';
import { CreateUserUseCase } from '../application/useCases/user.create.use-case';
import { UpdateUserUseCase } from '../application/useCases/user.update.use-case';
import { UserMapper } from '../infra/mappers/user.mappers';
import { PaginatedUserUseCase } from '../application/useCases/user.paginate.use-case';
import { UserPaginatedDto } from '../application/dtos/user.paginated.dto';

//@UseGuards(RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly createUser: CreateUserUseCase, private readonly updateUser: UpdateUserUseCase, private readonly paginateUser: PaginatedUserUseCase) {
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() userCreateDto: UserCreateDto, @Response() res) {
    console.log(userCreateDto);
    const user = await this.createUser.execute(userCreateDto);
    return ProcessResponse.setResponse(res, user, UserMapper.DomainToDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('update')
  async update(@Body() updateUserDto: UserUpdateDto, @Response() res) {
    console.log(updateUserDto);
    const user = await this.updateUser.execute(updateUserDto);
    return ProcessResponse.setResponse(res, user, UserMapper.DomainToDto);
  }

  @Post()
  async getAllPaginated(@Body() body: UserPaginatedDto, @Response() res) {
    //this._logger.log('Paginated');
    const pag = await this.paginateUser.execute(body);
    return ProcessResponse.setResponse(res, pag, (a) => a);
  }


}