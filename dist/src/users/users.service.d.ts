import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export declare class UsersService {
    private repo;
    constructor(repo: Repository<User>);
    findByEmail(email: string): Promise<User | null>;
    create(data: Partial<User>): Promise<User>;
}
