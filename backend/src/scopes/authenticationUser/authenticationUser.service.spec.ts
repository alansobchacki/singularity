import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { AuthenticationUsers } from './entities/authenticationUser.entity';
import { UserService } from './authenticationUser.service';
import { CreateUserDto, UserType } from './dto/create-user.dto';
import { FindUserByEmailDto } from './dto/find-user-by-email.dto';

jest.mock('../../utils/toxicity-check', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue(false),
}));

import * as toxicityCheck from '../../utils/toxicity-check';

require('dotenv').config();

describe('UsersService', () => {
  let service: UserService;
  let mockUserRepository;

  jest.mock('../../utils/toxicity-check', () => ({
    __esModule: true,
    default: jest.fn(),
  }));

  beforeEach(async () => {
    jest.clearAllMocks();

    const mockQueryBuilder = {
      orderBy: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
    };

    mockUserRepository = {
      checkToxicity: jest.fn(),
      create: jest.fn().mockImplementation((userData) => ({
        ...userData,
      })),
      save: jest.fn().mockImplementation(async (userData) => userData),
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
      findOneBy: jest.fn(),
      findOne: jest.fn(),
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

  describe('findByEmail', () => {
    it('should return a user when email is found', async () => {
      const findUserByEmailDto: FindUserByEmailDto = {
        email: 'chadwickboseman@email.com',
      };
      const user = {
        email: 'chadwickboseman@email.com',
        name: 'Chadwick Boseman',
      };

      mockUserRepository.findOneBy.mockResolvedValue(user);

      const result = await service.findByEmail(findUserByEmailDto);

      expect(result).toEqual(user);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({
        email: findUserByEmailDto.email,
      });
    });

    it('should return null when email is not found', async () => {
      const findUserByEmailDto: FindUserByEmailDto = {
        email: 'nonexistent@email.com',
      };

      mockUserRepository.findOneBy.mockResolvedValue(null);

      const result = await service.findByEmail(findUserByEmailDto);

      expect(result).toBeNull();
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({
        email: findUserByEmailDto.email,
      });
    });
  });

  describe('findById', () => {
    it('should return a user when id is found', async () => {
      const userId = '1';
      const user = {
        id: userId,
        email: 'chadwickboseman@email.com',
        name: 'Chadwick Boseman',
        password: 'hashedpassword',
      };

      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.findById(userId);

      expect(result).toEqual({
        id: userId,
        email: 'chadwickboseman@email.com',
        name: 'Chadwick Boseman',
      });
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });

    it('should throw an error when id is not found', async () => {
      const userId = 'nonexistent-id';

      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.findById(userId)).rejects.toThrow('User not found');

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });
  });

  describe('findAllUsers', () => {
    it('should find all users in the database', async () => {
      const users = [
        {
          email: 'chadwickboseman@email.com',
          name: 'Chadwick Boseman',
          password: 'testtest',
          userType: UserType.REGULAR,
        },
      ];

      mockUserRepository.createQueryBuilder().getMany.mockResolvedValue(users);

      const result = await service.findAllUsers();

      expect(result).toEqual(users);
      expect(mockUserRepository.createQueryBuilder).toHaveBeenCalledWith('authenticationUser');
      expect(mockUserRepository.createQueryBuilder().orderBy).toHaveBeenCalled();
      expect(mockUserRepository.createQueryBuilder().select).toHaveBeenCalled();
      expect(mockUserRepository.createQueryBuilder().getMany).toHaveBeenCalled();
    });

    it('should return an empty array if the database is empty', async () => {
      mockUserRepository.createQueryBuilder().getMany.mockResolvedValue([]);

      const result = await service.findAllUsers();

      expect(result).toEqual([]);
      expect(mockUserRepository.createQueryBuilder).toHaveBeenCalledWith('authenticationUser');
      expect(mockUserRepository.createQueryBuilder().orderBy).toHaveBeenCalled();
      expect(mockUserRepository.createQueryBuilder().select).toHaveBeenCalled();
      expect(mockUserRepository.createQueryBuilder().getMany).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    beforeEach(() => {
      (toxicityCheck.default as jest.Mock).mockClear();
    });

    it('should create a new user and return its data', async () => {
      const createUserDto: CreateUserDto = {
        email: 'chadwickboseman@email.com',
        name: 'Chadwick Boseman',
        password: 'testtest',
        userType: UserType.REGULAR,
      };

      const result = await service.create(createUserDto);

      expect(toxicityCheck.default).toHaveBeenCalledWith(createUserDto.name);
      expect(result).toMatchObject({
        email: createUserDto.email,
        name: createUserDto.name,
        profilePicture: expect.stringMatching(
          new RegExp(`^${process.env.AVATAR_BASE_URL}avatar[1-6]\\.jpg$`),
        ),
        password: expect.not.stringContaining(createUserDto.password), // improve this later
      });
    });

    it('should not allow user creation if user has a bad name', async () => {
      (toxicityCheck.default as jest.Mock).mockResolvedValueOnce(true);

      const createUserDto: CreateUserDto = {
        email: 'chadwickboseman@email.com',
        name: 'Toxic Name',
        password: 'testtest',
        userType: UserType.REGULAR,
      };

      await expect(service.create(createUserDto)).rejects.toThrow(
        BadRequestException,
      );

      expect(toxicityCheck.default).toHaveBeenCalledWith(createUserDto.name);
      expect(mockUserRepository.create).not.toHaveBeenCalled();
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });
  });
});
