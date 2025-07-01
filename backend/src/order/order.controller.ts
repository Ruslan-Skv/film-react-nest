import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, OrderResponseDto } from './dto/order.dto';

@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Post()
  async create(@Body() orders: CreateOrderDto[]): Promise<OrderResponseDto> {
      const results = await Promise.all(
            orders.map(order => this.orderService.create(order))
        );

        return {
            total: results.length,
            items: results.map(result => ({
                film: result.filmId,
                session: result.sessionId,
                daytime: result.daytime,
                row: result.row,
                seat: result.seat,
                price: result.price,
                id: result.bookingId
            }))
        };
    }
}
