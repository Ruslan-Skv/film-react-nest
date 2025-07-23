import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, OrderResponseDto } from './dto/order.dto';

@Controller('order')
export class OrderController {
  // Конструктор с внедрением зависимости OrderService
  // NestJS автоматически создаст и передаст экземпляр OrderService
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(
    // Декоратор @Body() извлекает данные из тела запроса и автоматически преобразует их в объект CreateOrderDto. @Body() для автоматического парсинга JSON из тела запроса
    @Body() order: CreateOrderDto
  ): Promise<OrderResponseDto> {
    return this.orderService.create(order.tickets);  // Вызов метода сервиса для создания заказа. Передаем только массив tickets из объекта заказа.
  }
}
