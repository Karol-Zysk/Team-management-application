import { UserService } from './user.service';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    getMe(user: User): User;
    updateUser(dto: UpdateUserDto, userId: string): Promise<User>;
}
