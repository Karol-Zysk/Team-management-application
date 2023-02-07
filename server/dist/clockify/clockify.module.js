"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClockifyModule = void 0;
const common_1 = require("@nestjs/common");
const clockify_service_1 = require("./clockify.service");
const crypto_module_1 = require("../cryptography/crypto.module");
const crypto_service_1 = require("../cryptography/crypto.service");
let ClockifyModule = class ClockifyModule {
};
ClockifyModule = __decorate([
    (0, common_1.Module)({
        imports: [crypto_module_1.CryptoModule],
        providers: [clockify_service_1.ClockifyService, crypto_service_1.CryptoService],
    })
], ClockifyModule);
exports.ClockifyModule = ClockifyModule;
//# sourceMappingURL=clockify.module.js.map