import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
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
    return this.userService.getMe(user);
  }
  @Patch(':id')
  updateUser(@Body() dto: UpdateUserDto, @Param('id') userId: string) {
    return this.userService.updateUser(userId, dto);
  }
}
