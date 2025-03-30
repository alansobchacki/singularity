import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthenticationUsers } from './entities/authenticationUser.entity';
import { UserService } from './authenticationUser.service';
import { CreateUserDto, UserType } from './dto/create-user.dto';

require('dotenv').config();

describe('UsersService', () => {
  let service: UserService;
  let mockUserRepository;

  beforeEach(async () => {
    mockUserRepository = {
      create: jest.fn().mockImplementation((userData) => ({
        ...userData,
      })),
      save: jest.fn().mockImplementation(async (userData) => userData),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(AuthenticationUsers),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create => should create a new user and return its data', async () => {
    const createUserDto: CreateUserDto = {
      email: 'chadwickboseman@email.com',
      name: 'Chadwick Boseman',
      password: 'testtest',
      userType: UserType.REGULAR,
    };

    const result = await service.create(createUserDto);

    // checks if the password is hashed and if the profile picture is randomly assigned
    expect(result).toMatchObject({
      email: createUserDto.email,
      name: createUserDto.name,
      profilePicture: expect.stringMatching(new RegExp(`^${process.env.AVATAR_BASE_URL}avatar[1-6]\\.jpg$`)),
      password: expect.not.stringContaining(createUserDto.password), // improve this later
    });
  });
});
