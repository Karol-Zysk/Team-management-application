import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { ClockifyModule } from '../clockify/clockify.module';
import { ClockifyService } from '../clockify/clockify.service';
import { CryptoModule } from '../cryptography/crypto.module';
import { CryptoService } from '../cryptography/crypto.service';

@Module({
  imports: [ClockifyModule, CryptoModule],
  providers: [ProjectsService, CryptoService, ClockifyService],
  controllers: [ProjectsController],
})
export class ProjectsModule {}
