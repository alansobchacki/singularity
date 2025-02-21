import {
  Controller,
  Query,
  Post,
  Body,
  Put,
  Param,
  Logger,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './authenticationUser.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findByEmail(@Query('email') email: string) {
    const user = await this.userService.findByEmail({ email });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  async findAll() {
    const users = await this.userService.findAllUsers();

    if (!users) {
      throw new Error('No users in the database!');
    }

    return users;
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    this.logger.log(`User created successfully: ${user.email}`);

    return user;
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userService.update(id, updateUserDto);
    this.logger.log(`User updated successfully: ${id}`);

    return updatedUser;
  }
}
