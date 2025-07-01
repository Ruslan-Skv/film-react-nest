//TODO реализовать DTO для /orders
// export class CreateOrderDto {
//   filmId: string;
//   sessionId: string;
//   seats: string[]; 
// }

export class CreateOrderDto {
  film: string;
  session: string;
  daytime: string;
  row: number;
  seat: number;
  price: number;
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