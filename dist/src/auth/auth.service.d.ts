import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private users;
    private jwt;
    constructor(users: UsersService, jwt: JwtService);
    validate(email: string, password: string): Promise<import("../users/entities/user.entity").User>;
    sign(user: {
        id: string;
        email: string;
    }): string;
}
