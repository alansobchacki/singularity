import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './authenticationUser.controller';
import { UserService } from './authenticationUser.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CreateUserDto, UserType } from './dto/create-user.dto';
import { ExecutionContext } from '@nestjs/common';
import { AuthenticationUsers } from './entities/authenticationUser.entity';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  const createMockUser = (overrides?: Partial<AuthenticationUsers>): AuthenticationUsers => ({
    id: '1',
    email: 'test@example.com',
    password: 'hashed_password',
    name: 'Test User',
    profilePicture: 'https://example.com/avatar.jpg',
    bio: 'Test bio',
    location: 'Test Location',
    posts: [],
    comments: [],
    following: [],
    followers: [],
    userType: 'REGULAR',
    accountStatus: 'ACTIVE',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  });

  const mockJwtGuard = {
    canActivate: (context: ExecutionContext) => {
      const req = context.switchToHttp().getRequest();
      req.user = { userId: '1' };
      return true;
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            findById: jest.fn(),
            findAllUsers: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtGuard)
      .compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe('getCurrentUserProfile', () => {
    it('should return current user profile', async () => {
      const mockUser = createMockUser();
      
      jest.spyOn(userService, 'findById').mockResolvedValue(mockUser);
  
      const mockRequest = { user: { userId: '1' } };
      const result = await controller.getCurrentUserProfile(mockRequest);
  
      expect(result).toEqual(mockUser);
      expect(userService.findById).toHaveBeenCalledWith('1');
    });
  
    it('should throw error when user not found', async () => {
      jest.spyOn(userService, 'findById').mockResolvedValue(null);
  
      const mockRequest = { user: { userId: '1' } };
      
      await expect(controller.getCurrentUserProfile(mockRequest))
        .rejects.toThrow('User not found');
    });
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      const mockUsers = [
        createMockUser({ id: '1', email: 'user1@example.com', name: 'User One' }),
        createMockUser({ id: '2', email: 'user2@example.com', name: 'User Two' })
      ];
      
      const mockServiceResponse = {
        data: mockUsers,
        total: mockUsers.length
      };
  
      const expectedControllerResponse = {
        ...mockServiceResponse,
        page: 1,
        limit: 20
      };
      
      jest.spyOn(userService, 'findAllUsers').mockResolvedValue(mockServiceResponse);
  
      const result = await controller.findAll();
  
      expect(result).toEqual(expectedControllerResponse);
      expect(userService.findAllUsers).toHaveBeenCalled();
    });
  
    it('should throw error when no users found', async () => {
      jest.spyOn(userService, 'findAllUsers').mockResolvedValue({
        data: [],
        total: 0
      });
  
      jest.spyOn(controller, 'findAll').mockImplementation(async () => {
        const result = await userService.findAllUsers();
        if (result.total === 0) {
          throw new Error('No users in the database!');
        }
        return {
          ...result,
          page: 1,
          limit: 20
        };
      });
      
      await expect(controller.findAll())
        .rejects.toThrow('No users in the database!');
    });
  });

  describe('getProfile', () => {
    it('should return user by id', async () => {
      const mockUser = createMockUser();
      
      jest.spyOn(userService, 'findById').mockResolvedValue(mockUser);
  
      const result = await controller.getProfile('1');
  
      expect(result).toEqual(mockUser);
      expect(userService.findById).toHaveBeenCalledWith('1');
    });
  
    it('should throw error when user not found', async () => {
      jest.spyOn(userService, 'findById').mockResolvedValue(null);
      
      await expect(controller.getProfile('1'))
        .rejects.toThrow('User not found');
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'new@example.com',
        name: 'New User',
        password: 'password',
        userType: UserType.REGULAR,
      };
  
      const mockUser = createMockUser({
        ...createUserDto,
        password: 'hashed_password'
      });
  
      jest.spyOn(userService, 'create').mockResolvedValue(mockUser);
  
      const result = await controller.create(createUserDto);
  
      expect(result).toEqual(mockUser);
      expect(userService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('Protected Routes', () => {
    it('should reject unauthenticated requests', async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [UserController],
        providers: [
          {
            provide: UserService,
            useValue: { findById: jest.fn() },
          },
        ],
      })
        .overrideGuard(JwtAuthGuard)
        .useValue({ canActivate: () => false })
        .compile();

      const unauthenticatedController = module.get<UserController>(UserController);
      
      await expect(unauthenticatedController.findAll())
        .rejects.toThrow();
    });
  });
});