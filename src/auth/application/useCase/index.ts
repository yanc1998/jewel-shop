import { ValidateUserUseCase } from './auth.validate.use-case';
import { LoginUseCase } from './auth.login.use-case';
import { RegisterUseCase } from './auth.register.use-case';
import {ConfirmRegisterUseCase} from "./auth.confirm.register.use-case";

export * from './auth.validate.use-case';
export * from './auth.login.use-case';

export const AuthUseCases = [
  ValidateUserUseCase,
  LoginUseCase,
  RegisterUseCase,
  ConfirmRegisterUseCase
];