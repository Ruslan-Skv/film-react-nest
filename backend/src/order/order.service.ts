import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateOrderDto,
  OrderItemDto,
  OrderResponseDto,
} from './dto/order.dto';
import { randomUUID } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { IFilmsRepository } from 'src/repository/films.repository';
import { Repository } from 'typeorm';
import { Schedule } from 'src/entity/schedule.entity';

@Injectable()
export class OrderService {
  constructor(
    @Inject('IFilmsRepository')
    private readonly filmsRepository: IFilmsRepository,

    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  async create(tickets: CreateOrderDto['tickets']): Promise<OrderResponseDto> {
    if (!tickets || tickets.length === 0) {
      throw new NotFoundException('No tickets provided');
    }

    const items: OrderItemDto[] = [];
    const schedulesToUpdate: Schedule[] = [];

    for (const ticket of tickets) {
      // Находим фильм с расписанием
      const film = await this.filmsRepository.findById(ticket.film);

      if (!film) {
        throw new NotFoundException(`Film ${ticket.film} not found`);
      }

      // Находим конкретный сеанс
      const session = film.schedules.find((s) => s.id === ticket.session);

      console.log('Session search:', {
        filmId: film.id,
        sessionId: ticket.session,
        available: film.schedules.map((s) => s.id),
      });

      if (!session) {
        throw new NotFoundException(
          `Session ${ticket.session} not found in film ${film.title}`,
        );
      }

      // Проверяем занятость места
      const seatKey = `${ticket.row}:${ticket.seat}`;
      if (session.taken.includes(seatKey)) {
        throw new ConflictException(`Seat ${seatKey} already taken`);
      }

      // Обновляем список занятых мест
      session.taken = [...session.taken, seatKey];
      schedulesToUpdate.push(session);

      items.push({
        film: ticket.film,
        session: ticket.session,
        daytime: session.daytime, // Берем из расписания
        row: ticket.row,
        seat: ticket.seat,
        price: session.price, // Берем из расписания
        id: randomUUID(),
      });
    }

    // Сохраняем все изменения в расписаниях одной транзакцией
    if (schedulesToUpdate.length > 0) {
      await this.scheduleRepository.save(schedulesToUpdate);
    }

    return {
      total: items.length,
      items,
    };
  }
}
