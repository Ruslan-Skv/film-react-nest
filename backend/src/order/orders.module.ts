import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { FilmsModule } from 'src/films/films.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from 'src/entity/schedule.entity';

@Module({
  imports: [FilmsModule, TypeOrmModule.forFeature([Schedule])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrdersModule {}
