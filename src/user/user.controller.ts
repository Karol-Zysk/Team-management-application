import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorators';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }
  @Patch('update')
  updateUser(@GetUser() user: User, @Body() dto: UpdateUserDto) {
    console.log(user);

    return this.userService.updateUser(user, dto);
  }
}
