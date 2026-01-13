import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'O título deve ter no mínimo 3 caracteres' })
  title: string;

  @IsString()
  @IsOptional()
  description?: string;
}