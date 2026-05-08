import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateStatusDto {
  @IsEnum(['pending', 'paid'])
  @IsNotEmpty()
  status: 'pending' | 'paid';
}
