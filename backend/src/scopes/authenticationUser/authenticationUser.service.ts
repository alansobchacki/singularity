import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthenticationUsers } from './entities/authenticationUser.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserByEmailDto } from './dto/find-user-by-email.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(AuthenticationUsers)
    private readonly userRepository: Repository<AuthenticationUsers>,
  ) {}

  async findByEmail(
    findUserByEmailDto: FindUserByEmailDto,
  ): Promise<AuthenticationUsers> {
    return await this.userRepository.findOneBy({
      email: findUserByEmailDto.email,
    });
  }

  async findById(id: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const { password, createdAt, updatedAt, ...sanitizedUser } = user;

    return sanitizedUser;
  }

  async findAllUsers() {
    const users = await this.userRepository
      .createQueryBuilder('authenticationUser')
      .orderBy('authenticationUser.createdAt', 'DESC')
      .select([
        'authenticationUser.id',
        'authenticationUser.name',
        'authenticationUser.email',
        'authenticationUser.bio',
        'authenticationUser.profilePicture',
      ])
      .getMany();

    return users;
  }

  async create(createUserDto: CreateUserDto): Promise<AuthenticationUsers> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    );
    const randomAvatar = Math.floor(Math.random() * 6) + 1;

    const user = this.userRepository.create({
      ...createUserDto,
      profilePicture: `${process.env.AVATAR_BASE_URL}avatar${randomAvatar}.jpg`,
      password: hashedPassword,
    });

    return await this.userRepository.save(user);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<AuthenticationUsers> {
    const user = await this.userRepository.preload({
      id,
      ...updateUserDto,
    });

    if (!user) {
      throw new Error('User not found');
    }

    return await this.userRepository.save(user);
  }
}
