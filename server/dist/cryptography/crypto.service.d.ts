import { ConfigService } from '@nestjs/config';
export declare class CryptoService {
    private config;
    private readonly key;
    private readonly salt;
    constructor(config: ConfigService);
    encrypt(text: string): string;
    decrypt(encryptedText: string): string;
}
