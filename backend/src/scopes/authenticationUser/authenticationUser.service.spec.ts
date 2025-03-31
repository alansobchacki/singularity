import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthenticationUsers } from './entities/authenticationUser.entity';
import { UserService } from './authenticationUser.service';
import { CreateUserDto, UserType } from './dto/create-user.dto';
import { FindUserByEmailDto } from './dto/find-user-by-email.dto';

require('dotenv').config();

describe('UsersService', () => {
  let service: UserService;
  let mockUserRepository;

  beforeEach(async () => {
    const mockQueryBuilder = {
      orderBy: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([
        {
          email: 'chadwickboseman@email.com',
          name: 'Chadwick Boseman',
          password: 'testtest',
          userType: UserType.REGULAR,
        },
      ]),
    };
  
    mockUserRepository = {
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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should return a user when email is found', async () => {
      const findUserByEmailDto: FindUserByEmailDto = {
        email: 'chadwickboseman@email.com',
      };
      const user = { email: 'chadwickboseman@email.com', name: 'Chadwick Boseman' };
      
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

  it('findAllUsers => should find all users in the database', async () => {
    const users = [
      {
        email: 'chadwickboseman@email.com',
        name: 'Chadwick Boseman',
        password: 'testtest',
        userType: UserType.REGULAR,
      },
    ];
  
    const result = await service.findAllUsers();

    expect(result).toEqual(users);
    expect(mockUserRepository.createQueryBuilder).toHaveBeenCalledWith('authenticationUser');
    expect(mockUserRepository.createQueryBuilder().orderBy).toHaveBeenCalled();
    expect(mockUserRepository.createQueryBuilder().select).toHaveBeenCalled();
    expect(mockUserRepository.createQueryBuilder().getMany).toHaveBeenCalled();
  })

  it('create => should create a new user and return its data', async () => {
    const createUserDto: CreateUserDto = {
      email: 'chadwickboseman@email.com',
      name: 'Chadwick Boseman',
      password: 'testtest',
      userType: UserType.REGULAR,
    };

    const result = await service.create(createUserDto);

    expect(result).toMatchObject({
      email: createUserDto.email,
      name: createUserDto.name,
      profilePicture: expect.stringMatching(new RegExp(`^${process.env.AVATAR_BASE_URL}avatar[1-6]\\.jpg$`)),
      password: expect.not.stringContaining(createUserDto.password), // improve this later
    });
  });
});
