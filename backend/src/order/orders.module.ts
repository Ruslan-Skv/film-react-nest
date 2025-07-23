import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { FilmsModule } from 'src/films/films.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from 'src/entity/schedule.entity';

@Module({
  // Импортируемые модули:
  imports: [
    FilmsModule, // Модуль фильмов - дает доступ к его экспортируемым провайдерам
    TypeOrmModule.forFeature([Schedule]) // Регистрация сущности Schedule в TypeORM // Это позволяет использовать ScheduleRepository в этом модуле
  ],
  controllers: [OrderController], // Контроллеры, которые принадлежат этому модулю // OrderController будет обрабатывать HTTP-запросы по заказам
  providers: [OrderService],   // Провайдеры (сервисы) модуля // OrderService содержит бизнес-логику работы с заказами
})
export class OrdersModule {}
