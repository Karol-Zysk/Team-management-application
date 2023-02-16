"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const pipes_1 = require("@nestjs/common/pipes");
const origin_1 = require("./utils/origin");
const port = process.env.PORT || 4000;
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new pipes_1.ValidationPipe({
        whitelist: true,
    }));
    app.enableCors({
        origin: origin_1.origin,
        credentials: true,
    });
    await app.listen(port);
}
bootstrap();
//# sourceMappingURL=main.js.map