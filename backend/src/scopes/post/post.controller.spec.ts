import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { UnauthorizedException } from '@nestjs/common';

describe('PostController', () => {
  let controller: PostController;
  let postService: PostService;

  const mockUser = {
    userId: 'user-1',
    userType: 'REGULAR'
  };

  const mockAdminUser = {
    userId: 'admin-1',
    userType: 'ADMIN'
  };

  const mockPost: Post = {
    id: 'post-1',
    content: 'Test post',
    author: { id: 'user-1' } as any,
    comments: [],
    likes: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        {
          provide: PostService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockPost),
            update: jest.fn().mockResolvedValue(mockPost),
            remove: jest.fn().mockResolvedValue(undefined),
            findUserAndFollowedPosts: jest.fn().mockResolvedValue([mockPost]),
            findEveryPost: jest.fn().mockResolvedValue([mockPost]),
            findUserPosts: jest.fn().mockResolvedValue([mockPost]),
          },
        },
      ],
    })
    .overrideGuard(JwtAuthGuard)
    .useValue({
      canActivate: (context) => {
        const req = context.switchToHttp().getRequest();
        req.user = mockUser;
        return true;
      },
    })
    .compile();

    controller = module.get<PostController>(PostController);
    postService = module.get<PostService>(PostService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createPost()', () => {
    it('should create a post successfully', async () => {
      const createDto: CreatePostDto = {
        content: 'New post',
        authorId: mockUser.userId
      };

      const result = await controller.createPost(createDto, { user: mockUser });

      expect(result).toEqual(mockPost);
      expect(postService.create).toHaveBeenCalledWith(createDto, mockUser.userId);
    });

    it('should reject unauthorized creation attempts', async () => {
      const createDto: CreatePostDto = {
        content: 'New post',
        authorId: 'different-user'
      };

      await expect(
        controller.createPost(createDto, { user: mockUser })
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('updatePost()', () => {
    it('should update a post (owner)', async () => {
      const updateDto: UpdatePostDto = { content: 'Updated content' };
      const result = await controller.updatePost('post-1', updateDto, { 
        user: mockUser 
      });

      expect(result).toEqual(mockPost);
      expect(postService.update).toHaveBeenCalledWith(
        updateDto, 'post-1', mockUser.userId, mockUser.userType
      );
    });

    it('should allow admin to update any post', async () => {
      const updateDto: UpdatePostDto = { content: 'Admin edit' };
      const result = await controller.updatePost('post-1', updateDto, { 
        user: mockAdminUser 
      });

      expect(result).toEqual(mockPost);
      expect(postService.update).toHaveBeenCalledWith(
        updateDto, 'post-1', mockAdminUser.userId, mockAdminUser.userType
      );
    });
  });

  describe('removePost()', () => {
    it('should delete a post (owner)', async () => {
      await controller.removePost('post-1', { user: mockUser });
      expect(postService.remove).toHaveBeenCalledWith(
        'post-1', mockUser.userId, mockUser.userType
      );
    });

    it('should allow admin to delete any post', async () => {
      await controller.removePost('post-1', { user: mockAdminUser });
      expect(postService.remove).toHaveBeenCalledWith(
        'post-1', mockAdminUser.userId, mockAdminUser.userType
      );
    });
  });

  describe('getTimeline()', () => {
    it('should return timeline for regular users', async () => {
      const result = await controller.getTimeline({ user: mockUser });
      expect(result).toEqual([mockPost]);
      expect(postService.findUserAndFollowedPosts).toHaveBeenCalledWith(mockUser.userId);
    });

    it('should return all posts for admins', async () => {
      const result = await controller.getTimeline({ user: mockAdminUser });
      expect(result).toEqual([mockPost]);
      expect(postService.findEveryPost).toHaveBeenCalledWith(mockAdminUser.userId);
    });

    it('should reject unauthenticated requests', async () => {
      await expect(controller.getTimeline({ user: null }))
        .rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getUserPosts()', () => {
    it('should return posts for specified user', async () => {
      const result = await controller.getUserPosts('user-1');
      expect(result).toEqual([mockPost]);
      expect(postService.findUserPosts).toHaveBeenCalledWith('user-1');
    });
  });
});