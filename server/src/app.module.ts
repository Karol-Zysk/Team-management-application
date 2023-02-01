import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { EmployeeModule } from './employee/employee.module';
import { CryptoModule } from './cryptography/crypto.module';
import { ClockifyModule } from './clockify/clockify.module';
import { ProjectsModule } from './projects/projects.module';
import { SalaryModule } from './salary/salary.module';
import { AppController } from './app.controller';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    PrismaModule,
    EmployeeModule,
    CryptoModule,
    ClockifyModule,
    ProjectsModule,
    SalaryModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
