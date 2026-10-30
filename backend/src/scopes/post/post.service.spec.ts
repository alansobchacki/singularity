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
    addOrderBy: jest.fn().mockReturnThis(),
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
    isPinned: false,
    isDeleted: false,
    editedBy: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockOtherUserPost: Post = {
    id: 'post-2',
    content: 'Other user post content',
    author: mockOtherUser,
    comments: [],
    likes: [],
    isPinned: false,
    isDeleted: false,
    editedBy: null,
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

  describe('update()', () => {
    it('should mark the post as edited by its author', async () => {
      jest.spyOn(postRepository, 'findOne').mockResolvedValue({ ...mockUserPost });
      jest.spyOn(postRepository, 'save').mockImplementation(async (post) => post as Post);

      const result = await service.update({ content: 'New content' }, 'post-1', 'user-1', 'REGULAR');

      expect(result.content).toBe('New content');
      expect(result.editedBy).toBe('AUTHOR');
    });

    it('should mark the post as edited by the moderation when an admin edits it', async () => {
      jest.spyOn(postRepository, 'findOne').mockResolvedValue({ ...mockOtherUserPost });
      jest.spyOn(postRepository, 'save').mockImplementation(async (post) => post as Post);

      const result = await service.update({ content: 'New content' }, 'post-2', 'user-1', 'ADMIN');

      expect(result.editedBy).toBe('MODERATION');
    });

    it("should not let regular users edit someone else's post", async () => {
      jest.spyOn(postRepository, 'findOne').mockResolvedValue({ ...mockOtherUserPost });

      await expect(
        service.update({ content: 'New content' }, 'post-2', 'user-1', 'REGULAR'),
      ).rejects.toThrow('You can only edit your own posts');
    });
  });

  describe('remove()', () => {
    it('should delete the post when its author removes it', async () => {
      jest.spyOn(postRepository, 'findOne').mockResolvedValue({ ...mockUserPost });

      await service.remove('post-1', 'user-1', 'REGULAR');

      expect(postRepository.delete).toHaveBeenCalledWith('post-1');
    });

    it('should only mark the post as deleted when an admin removes it', async () => {
      jest.spyOn(postRepository, 'findOne').mockResolvedValue({ ...mockOtherUserPost });

      await service.remove('post-2', 'user-1', 'ADMIN');

      expect(postRepository.delete).not.toHaveBeenCalled();
      expect(postRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'post-2', isDeleted: true }),
      );
    });
  });

  describe('pin()', () => {
    it('should let admins pin a post', async () => {
      jest.spyOn(postRepository, 'findOne').mockResolvedValue({ ...mockUserPost });
      jest.spyOn(postRepository, 'save').mockImplementation(async (post) => post as Post);

      const result = await service.pin('post-1', true, 'ADMIN');

      expect(result.isPinned).toBe(true);
    });

    it('should not let regular users pin posts', async () => {
      await expect(service.pin('post-1', true, 'REGULAR')).rejects.toThrow(
        'Only admins can pin posts',
      );
    });
  });

  describe('deleted posts', () => {
    it('should hide the content of posts deleted by the moderation', async () => {
      const mockQueryBuilder = createMockQueryBuilder([
        { ...mockOtherUserPost, isDeleted: true },
      ]);

      jest.spyOn(postRepository, 'createQueryBuilder')
        .mockImplementation(() => mockQueryBuilder);

      const { posts } = await service.findEveryPost();

      expect(posts[0].content).toBe('');
    });
  });
});
