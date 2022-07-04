import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';


const matchRoles = (roles, userRoles) => {
    return roles.some(role => role === userRoles);
};

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {

    }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        console.log(roles, 'roles')
        if (!roles) {
            return true;
        }
        const req = context.switchToHttp().getRequest();
        
        const user = req.user;
        return matchRoles(roles, user.role)
    }

}