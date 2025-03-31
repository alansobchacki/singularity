import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentService } from './comment.service';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';

jest.mock('../../utils/toxicity-check', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue(false),
}));

import checkToxicity from '../../utils/toxicity-check';

describe('CommentService', () => {
  let service: CommentService;
  let commentRepository: Repository<Comment>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: getRepositoryToken(Comment),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
    commentRepository = module.get<Repository<Comment>>(getRepositoryToken(Comment));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create()', () => {
    it('should successfully create a comment', async () => {
      const dto: CreateCommentDto = {
        userId: 'user-1',
        postId: 'post-1',
        content: 'Great post!',
      };

      const mockComment = {
        id: 'comment-1',
        ...dto,
        author: { id: dto.userId },
        post: { id: dto.postId },
        createdAt: new Date(),
      };

      (commentRepository.create as jest.Mock).mockReturnValue(mockComment);
      (commentRepository.save as jest.Mock).mockResolvedValue(mockComment);

      const result = await service.create(dto);

      expect(commentRepository.create).toHaveBeenCalledWith({
        author: { id: dto.userId },
        post: { id: dto.postId },
        content: dto.content,
        image: undefined,
      });
      expect(result).toEqual(mockComment);
    });

    it('should reject toxic comments', async () => {
      (checkToxicity as jest.Mock).mockResolvedValueOnce(true);
      const dto: CreateCommentDto = {
        userId: 'user-1',
        postId: 'post-1',
        content: 'Hateful comment',
      };

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });

    it('should handle missing user', async () => {
      const dto: CreateCommentDto = {
        userId: '',
        postId: 'post-1',
        content: 'Valid comment',
      };

      await expect(service.create(dto)).rejects.toThrow('User not found');
    });
  });

  describe('update()', () => {
    const existingComment = {
      id: 'comment-1',
      content: 'Original content',
      author: { id: 'user-1' },
      edited: false,
    };

    it('should update a comment successfully', async () => {
      const updateDto: UpdateCommentDto = {
        userId: 'user-1',
        content: 'Updated content',
      };

      (commentRepository.findOne as jest.Mock).mockResolvedValue(existingComment);
      (commentRepository.save as jest.Mock).mockImplementation((comment) => Promise.resolve(comment));

      const result = await service.update('comment-1', updateDto);

      expect(result.content).toBe('Updated content');
      expect(result.edited).toBe(true);
    });

    it('should reject unauthorized edits', async () => {
      const updateDto: UpdateCommentDto = {
        userId: 'user-2',
        content: 'Malicious edit',
      };

      (commentRepository.findOne as jest.Mock).mockResolvedValue(existingComment);

      await expect(service.update('comment-1', updateDto)).rejects.toThrow(
        new HttpException('You are not authorized to edit this comment', HttpStatus.FORBIDDEN),
      );
    });

    it('should throw if comment not found', async () => {
      (commentRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.update('nonexistent', { userId: 'user-1' })).rejects.toThrow(
        new HttpException('Comment not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('archive()', () => {
    const regularComment = {
      id: 'comment-1',
      status: 'REGULAR',
    };

    it('should archive a comment (admin only)', async () => {
      (commentRepository.findOne as jest.Mock).mockResolvedValue(regularComment);
      (commentRepository.save as jest.Mock).mockImplementation((comment) => Promise.resolve(comment));

      const result = await service.archive('comment-1', 'ADMIN');

      expect(result.status).toBe('ARCHIVED');
    });

    it('should reject non-admin users', async () => {
      await expect(service.archive('comment-1', 'REGULAR')).rejects.toThrow(
        new HttpException('You are not authorized to archive this comment', HttpStatus.FORBIDDEN),
      );
    });

    it('should throw if comment not found', async () => {
      (commentRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.archive('nonexistent', 'ADMIN')).rejects.toThrow(
        new HttpException('Comment not found', HttpStatus.NOT_FOUND),
      );
    });
  });
});