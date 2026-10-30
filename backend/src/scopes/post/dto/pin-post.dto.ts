import { IsBoolean } from 'class-validator';

export class PinPostDto {
  @IsBoolean()
  isPinned: boolean;
}
