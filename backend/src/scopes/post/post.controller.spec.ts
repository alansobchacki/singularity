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
    isPinned: false,
    isDeleted: false,
    editedBy: null,
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
            pin: jest.fn().mockResolvedValue({ ...mockPost, isPinned: true }),
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

  describe('pinPost()', () => {
    it("should pass the user's type to the service", async () => {
      const req = { user: mockAdminUser };
      await controller.pinPost('post-1', { isPinned: true }, req);

      expect(postService.pin).toHaveBeenCalledWith('post-1', true, 'ADMIN');
    });
  });

  describe('getTimeline()', () => {
    it('should return the requested page of posts', async () => {
      const result = await controller.getTimeline('2');
      expect(result).toEqual([mockPost]);
      expect(postService.findEveryPost).toHaveBeenCalledWith(2, 10);
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