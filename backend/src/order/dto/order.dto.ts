//TODO реализовать DTO для /orders
import { Type } from "class-transformer";
import { IsArray, IsEmail, IsISO8601, IsNumber, IsString, IsUUID, Min, ValidateNested } from "class-validator";

export class TicketDto {
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

export class CreateOrderDto {
  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TicketDto)
  tickets: TicketDto[];
}

export class OrderResponseDto {
  total: number;
  items: OrderItemDto[];
}

export class OrderItemDto {
  film: string;
  session: string;
  daytime: string;
  row: number;
  seat: number;
  price: number;
  id: string;
}

