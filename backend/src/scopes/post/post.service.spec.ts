import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { PostService } from './post.service';
import { Post } from './entities/post.entity';
import { AuthenticationUsers } from '../authenticationUser/entities/authenticationUser.entity';

const createMockQueryBuilder = (mockResults: any[] = []) => {
  return {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue(mockResults),
    getManyAndCount: jest.fn().mockResolvedValue([mockResults, mockResults.length]),
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

  const mockOtherUser: AuthenticationUsers = {
    ...mockUser,
    id: 'user-2',
    name: 'Other User'
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

  const mockOtherUserPost: Post = {
    id: 'post-2',
    content: 'Other user post content',
    author: mockOtherUser,
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
          provide: getRepositoryToken(AuthenticationUsers),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockUser),
          },
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    postRepository = module.get<Repository<Post>>(getRepositoryToken(Post));
    userRepository = module.get<Repository<AuthenticationUsers>>(getRepositoryToken(AuthenticationUsers));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findEveryPost()', () => {
    it('should return the first page of posts from every user', async () => {
      const mockQueryBuilder = createMockQueryBuilder([
        mockUserPost,
        mockOtherUserPost
      ]);

      jest.spyOn(postRepository, 'createQueryBuilder')
        .mockImplementation(() => mockQueryBuilder);

      const { posts, nextPage } = await service.findEveryPost();

      expect(posts).toHaveLength(2);
      expect(nextPage).toBeNull();
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
      expect(posts).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: 'post-1' }),
          expect.objectContaining({ id: 'post-2' })
        ])
      );
      expect(mockQueryBuilder.where).not.toHaveBeenCalled();
    });

    it('should point to the next page when more posts exist', async () => {
      const mockQueryBuilder = createMockQueryBuilder();
      (mockQueryBuilder.getManyAndCount as jest.Mock).mockResolvedValue([[mockUserPost], 11]);

      jest.spyOn(postRepository, 'createQueryBuilder')
        .mockImplementation(() => mockQueryBuilder);

      const { nextPage } = await service.findEveryPost(1, 10);

      expect(nextPage).toBe(2);
    });
  });
});
