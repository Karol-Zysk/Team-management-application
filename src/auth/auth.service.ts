import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  signIn() {
    return 2 + 3;
  }

  signUp() {
    return 5 + 6;
  }
}
