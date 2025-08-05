import { Body, Controller, Logger, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, OrderResponseDto } from './dto/order.dto';

@Controller('order')
export class OrderController {
  private readonly logger = new Logger(OrderController.name);
  
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() order: CreateOrderDto): Promise<OrderResponseDto> {
     this.logger.log('Received order creation request');
    const startTime = Date.now();

    try {
      const result = await this.orderService.create(order.tickets);
      const duration = Date.now() - startTime;
      
      this.logger.log(`Order processed successfully in ${duration}ms`);
      this.logger.debug(`Order details: ${JSON.stringify({
        ticketCount: result.total,
        firstItem: result.items[0],
      })}`);

      return result;
    } catch (error) {
      this.logger.error(`Order processing failed: ${error.message}`);
      throw error;
    }
  }
}
