import { Test, TestingModule } from '@nestjs/testing';
import { FollowRequestController } from './follow-request.controller';
import { FollowRequestService } from './follow-request.service';

describe('FollowRequestController', () => {
  let controller: FollowRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FollowRequestController],
      providers: [FollowRequestService],
    }).compile();

    controller = module.get<FollowRequestController>(FollowRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
