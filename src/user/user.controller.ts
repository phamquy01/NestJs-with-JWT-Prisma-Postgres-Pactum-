import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { MyJwtAuthGuard } from '../auth/guard';

@Controller('users')
export class UserController {
  @UseGuards(MyJwtAuthGuard)
  @Get('me')
  me(@GetUser() user: User) {
    return user;
  }
}
