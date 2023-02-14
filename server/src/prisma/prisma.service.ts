import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

const DB_URI = process.env.DB_URL;

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(private config: ConfigService) {
    super({
      datasources: {
        db: {
          url: DB_URI,
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
