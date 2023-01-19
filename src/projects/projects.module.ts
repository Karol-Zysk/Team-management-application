import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { ClockifyModule } from 'src/clockify/clockify.module';
import { ClockifyService } from 'src/clockify/clockify.service';
import { CryptoModule } from 'src/cryptography/crypto.module';
import { CryptoService } from 'src/cryptography/crypto.service';

@Module({
  imports: [ClockifyModule, CryptoModule],
  providers: [ProjectsService, CryptoService, ClockifyService],
  controllers: [ProjectsController],
})
export class ProjectsModule {}
