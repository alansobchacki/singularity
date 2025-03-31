import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { PostService } from './post.service';
import { Post } from './entities/post.entity';
import { Follow } from '../follow/entities/follow.entity';
import { AuthenticationUsers } from '../authenticationUser/entities/authenticationUser.entity';
import { UnauthorizedException } from '@nestjs/common';

const createMockQueryBuilder = (mockResults: any[] = []) => {
  return {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue(mockResults),
    getOne: jest.fn(),
    getRawOne: jest.fn(),
    getCount: jest.fn(),
    getRawMany: jest.fn(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    having: jest.fn().mockReturnThis(),
    connection: null,
    expressionMap: null,
    getQuery: jest.fn(),
    getParameters: jest.fn(),
  } as unknown as SelectQueryBuilder<Post>;
};

describe('PostService', () => {
  let service: PostService;
  let postRepository: Repository<Post>;
  let followRepository: Repository<Follow>;
  let userRepository: Repository<AuthenticationUsers>;

  const mockUser: AuthenticationUsers = {
    id: 'user-1',
    email: 'test@example.com',
    password: 'hashed_password',
    name: 'Test User',
    profilePicture: 'avatar.jpg',
    bio: null,
    location: null,
    posts: [],
    comments: [],
    following: [],
    followers: [],
    userType: 'REGULAR',
    accountStatus: 'ACTIVE',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockFollowedUser: AuthenticationUsers = {
    ...mockUser,
    id: 'user-2',
    name: 'Followed User'
  };

  const mockFollow: Follow = {
    id: 'follow-1',
    follower: mockUser,
    following: mockFollowedUser,
    status: 'ACCEPTED',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserPost: Post = {
    id: 'post-1',
    content: 'User post content',
    author: mockUser,
    comments: [],
    likes: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockFollowedUserPost: Post = {
    id: 'post-2',
    content: 'Followed user post content',
    author: mockFollowedUser,
    comments: [],
    likes: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: getRepositoryToken(Post),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
            createQueryBuilder: jest.fn(() => createMockQueryBuilder()),
          },
        },
        {
          provide: getRepositoryToken(Follow),
          useValue: {
            find: jest.fn().mockResolvedValue([mockFollow]),
            createQueryBuilder: jest.fn(() => createMockQueryBuilder()),
          },
        },
        {
          provide: getRepositoryToken(AuthenticationUsers),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockUser),
          },
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    postRepository = module.get<Repository<Post>>(getRepositoryToken(Post));
    followRepository = module.get<Repository<Follow>>(getRepositoryToken(Follow));
    userRepository = module.get<Repository<AuthenticationUsers>>(getRepositoryToken(AuthenticationUsers));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findUserAndFollowedPosts()', () => {
    it('should return posts from user and followed users', async () => {
      const mockQueryBuilder = createMockQueryBuilder([
        mockUserPost,
        mockFollowedUserPost
      ]);
      
      jest.spyOn(postRepository, 'createQueryBuilder')
        .mockImplementation(() => mockQueryBuilder);

      jest.spyOn(followRepository, 'find').mockResolvedValue([mockFollow]);

      const result = await service.findUserAndFollowedPosts(mockUser.id);

      expect(result).toHaveLength(2);
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: 'post-1' }),
          expect.objectContaining({ id: 'post-2' })
        ])
      );

      expect(followRepository.find).toHaveBeenCalledWith({
        where: { 
          follower: { id: mockUser.id },
          status: 'ACCEPTED'
        },
        relations: ['following']
      });

      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'post.author.id IN (:...userAndFollowedIds)',
        { userAndFollowedIds: [mockUser.id, mockFollowedUser.id] }
      );
    });

    it('should return only user posts when no follows exist', async () => {
      const mockQueryBuilder = createMockQueryBuilder([mockUserPost]);
      
      jest.spyOn(postRepository, 'createQueryBuilder')
        .mockImplementation(() => mockQueryBuilder);

      jest.spyOn(followRepository, 'find').mockResolvedValue([]);

      const result = await service.findUserAndFollowedPosts(mockUser.id);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('post-1');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'post.author.id IN (:...userAndFollowedIds)',
        { userAndFollowedIds: [mockUser.id] }
      );
    });

    it('should throw when user is not authenticated', async () => {
      await expect(service.findUserAndFollowedPosts(''))
        .rejects.toThrow(UnauthorizedException);
    });
  });
});