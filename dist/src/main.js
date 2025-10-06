"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const swagger_1 = require("@nestjs/swagger");
const audit_interceptor_1 = require("./common/interceptors/audit.interceptor");
const logger_1 = require("./common/logger");
const path = require("path");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        bufferLogs: true,
        logger: logger_1.appLogger,
    });
    app.use((req, _res, next) => {
        req.reqId = (0, uuid_1.v4)();
        next();
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true
        }
    }));
    const auditInterceptor = app.get(audit_interceptor_1.AuditInterceptor);
    app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor(), auditInterceptor);
    app.useGlobalFilters(new http_exception_filter_1.AllExceptionsFilter());
    const uploadsPath = path.resolve(process.cwd(), 'uploads');
    app.useStaticAssets(uploadsPath, {
        prefix: '/uploads/',
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Library API')
        .setDescription('API REST de SMPC Libros')
        .setVersion('1.0.1')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document);
    await app.listen(process.env.PORT || 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map