import {Body, Controller, Param, Post, Request, Response, UseGuards} from '@nestjs/common';
import {ProcessResponse} from 'src/shared/core/utils/processResponse';
import {RegisterDto} from '../application/dtos/register.dto';
import {LocalAuthGuard} from '../application/guards/localAuthGuard';
import {LoginUseCase} from '../application/useCase/auth.login.use-case';
import {RegisterUseCase} from '../application/useCase/auth.register.use-case';
import {UserMapper} from '../../user/infra/mappers/user.mappers';
import {ConfirmRegisterUseCase} from '../application/useCase/auth.confirm.register.use-case';
import {Response as Res} from 'express';
import {RolesGuard} from "../application/guards/roleGuard";

import {Roles} from '../application/guards/role'
import {Roles as Role} from "../../shared/domain/enum.permits";
import {JwtAuthGuard} from "../application/guards/jwtAuthGuard";
import {ConfirmRegisterDto} from "../application/dtos/confirm.register.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authRegister: RegisterUseCase,
                private readonly authLogin: LoginUseCase,
                private readonly confirmRegister: ConfirmRegisterUseCase) {
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async Login(@Request() req, @Response() res: Res) {
        const login = await this.authLogin.execute(req.user);
        return ProcessResponse.setResponse(res, login, (a) => a);
    }

    @Post('register')
    async Register(@Body() userDto: RegisterDto, @Response() res) {
        const user = await this.authRegister.execute(userDto);
        return ProcessResponse.setResponse(res, user, (a) => a);
    }

    @Post('confirm-register')
    async ConfirmRegister(@Body() confirmRegisterDto: ConfirmRegisterDto, @Response() res) {
        const user = await this.confirmRegister.execute(confirmRegisterDto);
        return ProcessResponse.setResponse(res, user, UserMapper.DomainToDto);
    }

    @Roles(Role.Admin)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Post('check-admin')
    checkAdmin() {
        return true
    }
}
