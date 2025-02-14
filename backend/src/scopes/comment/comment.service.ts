import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const { userId, postId, content, image } = createCommentDto;

    const comment = this.commentRepository.create({
      author: { id: userId },
      post: { id: postId },
      content: content,
      image: image,
    });

    return this.commentRepository.save(comment);
  }

  async update(id: string, commentData: UpdateCommentDto): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!comment)
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);

    if (comment.author.id !== commentData.userId) {
      throw new HttpException(
        'You are not authorized to edit this comment',
        HttpStatus.FORBIDDEN,
      );
    }

    comment.content = commentData.content;
    comment.image = commentData.image;
    comment.edited = true;

    return this.commentRepository.save(comment);
  }

  async archive(id: string, userType: string): Promise<Comment> {
    if (userType !== 'ADMIN') {
      throw new HttpException(
        'You are not authorized to archive this comment',
        HttpStatus.FORBIDDEN,
      );
    }

    const comment = await this.commentRepository.findOne({ where: { id } });

    if (!comment) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }

    comment.status = 'ARCHIVED';

    return this.commentRepository.save(comment);
  }
}
