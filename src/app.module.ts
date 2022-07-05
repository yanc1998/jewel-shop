import {Module} from '@nestjs/common';
import {DataAccessModule} from './shared/modules/data-access/data-access.module';
import {UserModule} from './user/user.module';
import {EmailModule} from './email/email.module';
import {AuthModule} from './auth/auth.module';
import {CategoryModule} from "./category/category.module";

@Module({
    imports: [
        DataAccessModule,
        UserModule,
        EmailModule,
        AuthModule,
        CategoryModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule {
}
