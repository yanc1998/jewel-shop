import {Module} from '@nestjs/common';
import {DataAccessModule} from './shared/modules/data-access/data-access.module';
import {UserModule} from './user/user.module';
import {EmailModule} from './email/email.module';
import {AuthModule} from './auth/auth.module';


@Module({
    imports: [
        DataAccessModule,
        UserModule,
        EmailModule,
        AuthModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {
}
