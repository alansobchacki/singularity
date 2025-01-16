import { Test, TestingModule } from '@nestjs/testing';
import { FollowRequestService } from './follow-request.service';

describe('FollowRequestService', () => {
  let service: FollowRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FollowRequestService],
    }).compile();

    service = module.get<FollowRequestService>(FollowRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
