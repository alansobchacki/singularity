import {
  Controller,
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

  @Get('self')
  @UseGuards(JwtAuthGuard)
  async getCurrentUserProfile(@Request() req) {
    const userId = req.user?.userId;

    const user = await this.userService.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
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

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Param('id') id: string) {
    const user = await this.userService.findById(id);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
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
