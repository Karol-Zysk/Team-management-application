import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorators';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  getMe(@GetUser() user: User) {
    return this.userService.getMe(user);
  }

  @Patch('')
  updateUser(@Body() dto: UpdateUserDto, @GetUser('id') userId: string) {
    return this.userService.updateUser(userId, dto);
  }
}
