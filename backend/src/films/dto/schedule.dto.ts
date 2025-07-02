import { 
  IsArray, 
  IsNumber, 
  IsString, 
  IsNotEmpty, 
  IsPositive, 
  ValidateNested, 
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SessionDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  daytime: string;

  @IsNumber()
  @IsPositive()
  hall: number;

  @IsNumber()
  @IsPositive()
  rows: number;

  @IsNumber()
  @IsPositive()
  seats: number;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsArray()
  @IsString({ each: true })
  taken: string[];
}

export class ScheduleResponseDto {
  @IsNumber()
  @IsPositive()
  total: number;

  @IsArray()
  @ArrayMinSize(0)
  @ValidateNested({ each: true })
  @Type(() => SessionDto)
  items: SessionDto[];
}