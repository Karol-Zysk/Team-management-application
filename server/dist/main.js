"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const pipes_1 = require("@nestjs/common/pipes");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new pipes_1.ValidationPipe({
        whitelist: true,
    }));
    app.enableCors({
        origin: 'http://127.0.0.1:5173',
        credentials: true,
    });
    await app.listen(4000);
}
bootstrap();
//# sourceMappingURL=main.js.map