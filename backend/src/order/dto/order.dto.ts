//TODO реализовать DTO для /orders
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsISO8601,
  IsNumber,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
  IsNotEmpty,
  IsPhoneNumber,
  IsPositive,
  ArrayMinSize,
} from 'class-validator';

export class TicketDto {
  @IsUUID()
  @IsNotEmpty()
  film: string;

  @IsUUID()
  @IsNotEmpty()
  session: string;

  @IsISO8601()
  @IsNotEmpty()
  daytime: string;

  @IsNumber()
  @Min(1)
  @IsPositive()
  row: number;

  @IsNumber()
  @Min(1)
  @IsPositive()
  seat: number;

  @IsNumber()
  @Min(0)
  price: number;
}

export class CreateOrderDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsPhoneNumber()
  phone: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'At least one ticket is required' })
  @ValidateNested({ each: true })
  @Type(() => TicketDto)
  tickets: TicketDto[];
}

export class OrderResponseDto {
  @IsNumber()
  @IsPositive()
  total: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}

export class OrderItemDto {
  @IsUUID()
  id: string;

  @IsUUID()
  film: string;

  @IsUUID()
  session: string;

  @IsISO8601()
  daytime: string;

  @IsNumber()
  @Min(1)
  row: number;

  @IsNumber()
  @Min(1)
  seat: number;

  @IsNumber()
  @Min(0)
  price: number;
}
