import { Test, TestingModule } from '@nestjs/testing';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { Comment } from './entities/comment.entity';

describe('CommentController', () => {
  let controller: CommentController;
  let commentService: CommentService;

  const mockUser = {
    userId: 'user-1',
    userType: 'REGULAR',
  };

  const mockAdminUser = {
    userId: 'admin-1',
    userType: 'ADMIN',
  };

  const createMockComment = (overrides?: Partial<Comment>): Comment => ({
    id: 'comment-1',
    content: 'Test comment content',
    image: 'image.jpg',
    edited: false,
    status: 'REGULAR',
    author: { 
      id: mockUser.userId,
      name: 'Test User',
      email: 'test@example.com'
    } as any,
    post: {
      id: 'post-1',
      content: 'Original post'
    } as any,
    likes: [],
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
    ...overrides
  });

  const mockComment = createMockComment();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [
        {
          provide: CommentService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            archive: jest.fn(),
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

    controller = module.get<CommentController>(CommentController);
    commentService = module.get<CommentService>(CommentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create()', () => {
    it('should create a comment successfully', async () => {
      const createDto: CreateCommentDto = {
        postId: 'post-1',
        content: 'Great post!',
      };

      jest.spyOn(commentService, 'create').mockResolvedValue(mockComment);

      const result = await controller.create(createDto, { user: mockUser });

      expect(commentService.create).toHaveBeenCalledWith({
        ...createDto,
        userId: mockUser.userId,
      });
      expect(result).toEqual(mockComment);
    });

    it('should require postId', async () => {
      await expect(controller.create({} as CreateCommentDto, { user: mockUser }))
        .rejects.toThrow(UnauthorizedException);
    });
  });

  describe('update()', () => {
    const updateDto: UpdateCommentDto = {
      content: 'Updated content',
    };

    it('should update a comment successfully', async () => {
      jest.spyOn(commentService, 'update').mockResolvedValue(mockComment);

      const result = await controller.update('comment-1', updateDto, { user: mockUser });

      expect(result).toEqual({
        success: true,
        message: 'Comment updated succesfully',
        data: mockComment,
      });
      expect(commentService.update).toHaveBeenCalledWith('comment-1', {
        ...updateDto,
        userId: mockUser.userId,
      });
    });

    it('should handle update errors', async () => {
      jest.spyOn(commentService, 'update').mockRejectedValue(new Error());

      await expect(controller.update('comment-1', updateDto, { user: mockUser }))
        .rejects.toThrow(HttpException);
    });
  });

  describe('archive()', () => {
    it('should archive a comment (admin only)', async () => {
      jest.spyOn(commentService, 'archive').mockResolvedValue(mockComment);

      const result = await controller.archive('comment-1', { user: mockAdminUser });

      expect(result).toEqual({
        success: true,
        message: 'Comment archived succesfully',
        data: mockComment,
      });
      expect(commentService.archive).toHaveBeenCalledWith('comment-1', mockAdminUser.userType);
    });

    it('should reject non-admin users', async () => {
      jest.spyOn(commentService, 'archive').mockRejectedValue(
        new HttpException('Forbidden', HttpStatus.FORBIDDEN)
      );

      await expect(controller.archive('comment-1', { user: mockUser }))
        .rejects.toThrow(HttpException);
    });

    it('should handle archive errors', async () => {
      jest.spyOn(commentService, 'archive').mockRejectedValue(new Error());

      await expect(controller.archive('comment-1', { user: mockAdminUser }))
        .rejects.toThrow(HttpException);
    });
  });

  describe('JWT Guard', () => {
    it('should protect all routes', () => {
      const guards = Reflect.getMetadata('__guards__', CommentController);
      expect(guards[0].name).toBe(JwtAuthGuard.name);
    });
  });
});