import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthenticationUsers } from './entities/authenticationUser.entity';
import { UserService } from './authenticationUser.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUserByEmailDto } from './dto/find-user-by-email.dto';
import { RedisCacheService } from '../../infrastructure/caching/redis-cache.service';

require('dotenv').config();

describe('UsersService', () => {
  let service: UserService;
  let mockUserRepository;
  const mockQueryBuilder = {
    orderBy: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
  };
  const mockRedisCacheService = {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn(),
    del: jest.fn(),
    delPattern: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    mockUserRepository = {
      create: jest.fn().mockImplementation((userData) => ({
        ...userData,
      })),
      save: jest.fn().mockImplementation(async (userData) => userData),
      createQueryBuilder: jest.fn(() => mockQueryBuilder),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(AuthenticationUsers),
          useValue: mockUserRepository,
        },
        {
          provide: RedisCacheService,
          useValue: mockRedisCacheService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe('findByEmail', () => {
    it('should return a user with their password hash when email is found', async () => {
      const findUserByEmailDto: FindUserByEmailDto = {
        email: 'chadwickboseman@email.com',
      };
      const user = {
        id: '1',
        email: 'chadwickboseman@email.com',
        password: 'hashed_password',
      };

      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.findByEmail(findUserByEmailDto);

      expect(result).toEqual(user);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: findUserByEmailDto.email },
        select: {
          id: true,
          email: true,
          password: true,
          userType: true,
          accountStatus: true,
        },
      });
    });

    it('should return null when email is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail({ email: 'nonexistent@email.com' });

      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return a user when id is found', async () => {
      const user = {
        id: '1',
        email: 'chadwickboseman@email.com',
        name: 'Chadwick Boseman',
      };

      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.findById('1');

      expect(result).toEqual(user);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw an error when id is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.findById('nonexistent-id')).rejects.toThrow('User not found');
    });
  });

  describe('findAllUsers', () => {
    it('should return pagination info followed by the users', async () => {
      const users = [
        {
          id: '1',
          name: 'Chadwick Boseman',
          bio: 'Actor',
          profilePicture: 'avatar1.jpg',
        },
      ];

      mockQueryBuilder.getManyAndCount.mockResolvedValue([users, users.length]);

      const result = await service.findAllUsers(1, 10);

      expect(result).toEqual([
        { page: 1, limit: 10, total: 1, totalPages: 1 },
        ...users,
      ]);
      expect(mockQueryBuilder.select).toHaveBeenCalledWith([
        'authenticationUser.id',
        'authenticationUser.name',
        'authenticationUser.bio',
        'authenticationUser.profilePicture',
      ]);
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
    });

    it('should skip the right amount of users for page 2', async () => {
      mockQueryBuilder.getManyAndCount.mockResolvedValue([[], 0]);

      await service.findAllUsers(2, 10);

      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(10);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
    });

    it('should default to 10 users per page', async () => {
      mockQueryBuilder.getManyAndCount.mockResolvedValue([[], 0]);

      await service.findAllUsers();

      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
    });
  });

  describe('create', () => {
    it('should create a new user without returning the password hash', async () => {
      const createUserDto: CreateUserDto = {
        email: 'chadwickboseman@email.com',
        name: 'Chadwick Boseman',
        password: 'testtest',
      };

      const result = await service.create(createUserDto);

      expect(result).toMatchObject({
        email: createUserDto.email,
        name: createUserDto.name,
        profilePicture: expect.stringMatching(
          new RegExp(`^${process.env.AVATAR_BASE_URL}avatar[1-6]\\.jpg$`),
        ),
      });
      expect(result).not.toHaveProperty('password');
      expect(mockUserRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          password: expect.not.stringContaining(createUserDto.password),
        }),
      );
    });
  });
});
