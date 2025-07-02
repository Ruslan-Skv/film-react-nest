import { IsArray, IsNumber, IsString, IsNotEmpty, IsUrl, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class FilmItemDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsNumber()
  rating: number;

  @IsString()
  @IsNotEmpty()
  director: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  about: string;

  @IsString()
  description: string;

  @IsUrl()
  image: string;

  @IsUrl()
  cover: string;
}

export class FilmResponseDto {
  @IsNumber()
  total: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FilmItemDto)
  items: FilmItemDto[];
}