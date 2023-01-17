import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AES, enc } from 'crypto-js';

@Injectable()
export class CryptoService {
  private readonly key: string;
  private readonly salt: string;

  constructor(private config: ConfigService) {
    this.key = this.config.get('ENCRYPTION_KEY');
    this.salt = this.config.get('SALT');
  }

  encrypt(text: string): string {
    const encrypted = AES.encrypt(text, this.key + this.salt).toString();
    return encrypted;
  }

  decrypt(encryptedText: string): string {
    const decrypted = AES.decrypt(encryptedText, this.key + this.salt).toString(
      enc.Utf8,
    );
    return decrypted;
  }
}
