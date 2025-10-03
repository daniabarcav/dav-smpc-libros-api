"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const core_1 = require("@nestjs/core");
const audit_service_1 = require("../../audit/audit.service");
let AuditInterceptor = class AuditInterceptor {
    constructor(moduleRef) {
        this.moduleRef = moduleRef;
    }
    intercept(ctx, next) {
        const req = ctx.switchToHttp().getRequest();
        const method = String(req.method || '').toUpperCase();
        const action = { POST: 'create', PATCH: 'update', DELETE: 'delete' }[method] ?? 'read';
        return next.handle().pipe((0, operators_1.tap)(async (result) => {
            try {
                const audit = this.moduleRef.get(audit_service_1.AuditService, { strict: false });
                await audit.log({
                    action,
                    entity: req.route?.path?.startsWith('/books') ? 'Book' : 'Unknown',
                    entityId: (result?.id ?? req.params?.id) || undefined,
                    after: (action === 'create' || action === 'update' || action === 'delete') ? result : undefined,
                    userId: req.user?.sub,
                    reqId: req.reqId,
                });
            }
            catch { }
        }));
    }
};
exports.AuditInterceptor = AuditInterceptor;
exports.AuditInterceptor = AuditInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.ModuleRef])
], AuditInterceptor);
//# sourceMappingURL=audit.interceptor.js.map