import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import Clockify from 'clockify-ts';
import { CryptoService } from 'src/cryptography/crypto.service';

@Injectable()
export class ClockifyService {
  private clockify: Clockify;

  constructor(private cryptoService: CryptoService) {}

  async getEmployees(user: User) {
    const apiKey = this.cryptoService.decrypt(user.hash_api_key);
    this.clockify = new Clockify(apiKey);
    const workspaces = await this.clockify.workspaces.get();

    const employees = await this.clockify.workspaces
      .withId(workspaces[0].id)
      .users.get({});

    return employees;
  }
}
