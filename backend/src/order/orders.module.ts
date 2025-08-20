import { Logger, Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { FilmsModule } from '../films/films.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from '../entity/schedule.entity';

@Module({
  imports: [FilmsModule, TypeOrmModule.forFeature([Schedule])],
  controllers: [OrderController],
  providers: [OrderService,
    {
      provide: 'ORDERS_MODULE_LOGGER',
      useValue: new Logger('OrdersModule'),
    },
  ],
})
export class OrdersModule {
  private readonly logger = new Logger(OrdersModule.name);

  constructor() {
    this.logger.log('Orders module initialized');
  }
}
