import { IsOptional, IsString, MinLength, IsIn } from 'class-validator';

export class UpdateTicketDto {
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'O título deve ter no mínimo 3 caracteres' })
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(['OPEN', 'IN_PROGRESS', 'DONE'])
  status?: string;
}
