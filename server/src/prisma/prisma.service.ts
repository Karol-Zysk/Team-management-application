import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(private config: ConfigService) {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }
  cleanDB() {
    return this.$transaction([
      this.report.deleteMany(),
      this.project.deleteMany(),
      this.employee.deleteMany(),
      this.user.deleteMany(),
    ]);
  }
}
