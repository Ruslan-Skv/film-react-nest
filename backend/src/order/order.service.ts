import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateOrderDto,
  OrderItemDto,
  OrderResponseDto,
} from './dto/order.dto';
import { randomUUID } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { IFilmsRepository } from '../repository/films.repository';
import { Repository } from 'typeorm';
import { Schedule } from '../entity/schedule.entity';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);
  
  constructor(
    @Inject('IFilmsRepository')
    private readonly filmsRepository: IFilmsRepository,

    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  async create(tickets: CreateOrderDto['tickets']): Promise<OrderResponseDto> {
    this.logger.log('Creating new order');

    if (!tickets || tickets.length === 0) {
      this.logger.warn('Order creation failed: no tickets provided');
      throw new NotFoundException('No tickets provided');
    }

    const items: OrderItemDto[] = [];
    const schedulesToUpdate: Schedule[] = [];

    try {
      for (const ticket of tickets) {
        this.logger.debug(`Processing ticket for film: ${ticket.film}, session: ${ticket.session}`);

        const film = await this.filmsRepository.findById(ticket.film);

        if (!film) {
          this.logger.warn(`Film not found: ${ticket.film}`);
          throw new NotFoundException(`Film ${ticket.film} not found`);
        }

        const session = film.schedules.find((s) => s.id === ticket.session);
        this.logger.debug(`Session search result: ${session ? 'found' : 'not found'}`);

        if (!session) {
          this.logger.warn(`Session not found: ${ticket.session} in film ${film.title}`);
          throw new NotFoundException(
            `Session ${ticket.session} not found in film ${film.title}`,
          );
        }

        // Проверяем занятость места
        const seatKey = `${ticket.row}:${ticket.seat}`;
        const takenSeats = session.taken || []; // Используем массив напрямую
        
        if (takenSeats.includes(seatKey)) {
          this.logger.warn(`Seat already taken: ${seatKey} in session ${session.id}`);
          throw new ConflictException(`Seat ${seatKey} already taken`);
        }

        // Обновляем список занятых мест
        session.taken = [...takenSeats, seatKey]; // Создаем новый массив с добавленным местом
        schedulesToUpdate.push(session);

        items.push({
          film: ticket.film,
          session: ticket.session,
          daytime: session.daytime,
          row: ticket.row,
          seat: ticket.seat,
          price: session.price,
          id: randomUUID(),
        });
      }

      // Сохраняем все изменения в расписаниях одной транзакцией
      if (schedulesToUpdate.length > 0) {
        this.logger.log(`Updating ${schedulesToUpdate.length} schedules`);
        await this.scheduleRepository.save(schedulesToUpdate);
      }

      this.logger.log(`Order created successfully with ${items.length} items`);
      return {
        total: items.length,
        items,
      };
    } catch (error) {
      this.logger.error(`Order creation failed: ${error.message}`, error.stack);
      throw error;
    }
  }
}

// import {
//   ConflictException,
//   Inject,
//   Injectable,
//   Logger,
//   NotFoundException,
// } from '@nestjs/common';
// import {
//   CreateOrderDto,
//   OrderItemDto,
//   OrderResponseDto,
// } from './dto/order.dto';
// import { randomUUID } from 'crypto';
// import { InjectRepository } from '@nestjs/typeorm';
// import { IFilmsRepository } from '../repository/films.repository';
// import { Repository } from 'typeorm';
// import { Schedule } from '../entity/schedule.entity';

// @Injectable()
// export class OrderService {
//   private readonly logger = new Logger(OrderService.name);
  
//   constructor(
//     @Inject('IFilmsRepository')
//     private readonly filmsRepository: IFilmsRepository,

//     @InjectRepository(Schedule)
//     private readonly scheduleRepository: Repository<Schedule>,
//   ) {}

//   async create(tickets: CreateOrderDto['tickets']): Promise<OrderResponseDto> {
//     this.logger.log('Creating new order');

//     if (!tickets || tickets.length === 0) {
//       this.logger.warn('Order creation failed: no tickets provided');
//       throw new NotFoundException('No tickets provided');
//     }

//     const items: OrderItemDto[] = [];
//     const schedulesToUpdate: Schedule[] = [];

//     try {
//       for (const ticket of tickets) {
//         this.logger.debug(`Processing ticket for film: ${ticket.film}, session: ${ticket.session}`);

//         const film = await this.filmsRepository.findById(ticket.film);

//         if (!film) {
//           this.logger.warn(`Film not found: ${ticket.film}`);
//           throw new NotFoundException(`Film ${ticket.film} not found`);
//         }

//         const session = film.schedules.find((s) => s.id === ticket.session);
//         this.logger.debug(`Session search result: ${session ? 'found' : 'not found'}`);

//         if (!session) {
//           this.logger.warn(`Session not found: ${ticket.session} in film ${film.title}`);
//           throw new NotFoundException(
//             `Session ${ticket.session} not found in film ${film.title}`,
//           );
//         }

//         // Проверяем занятость места
//         const seatKey = `${ticket.row}:${ticket.seat}`;
//         const takenSeats = session.taken ? session.taken.split(',') : [];
        
//         if (takenSeats.includes(seatKey)) {
//           this.logger.warn(`Seat already taken: ${seatKey} in session ${session.id}`);
//           throw new ConflictException(`Seat ${seatKey} already taken`);
//         }

//         // Обновляем список занятых мест
//         takenSeats.push(seatKey);
//         session.taken = takenSeats.join(',');
//         schedulesToUpdate.push(session);

//         items.push({
//           film: ticket.film,
//           session: ticket.session,
//           daytime: session.daytime,
//           row: ticket.row,
//           seat: ticket.seat,
//           price: session.price,
//           id: randomUUID(),
//         });
//       }

//       // Сохраняем все изменения в расписаниях одной транзакцией
//       if (schedulesToUpdate.length > 0) {
//         this.logger.log(`Updating ${schedulesToUpdate.length} schedules`);
//         await this.scheduleRepository.save(schedulesToUpdate);
//       }

//       this.logger.log(`Order created successfully with ${items.length} items`);
//       return {
//         total: items.length,
//         items,
//       };
//     } catch (error) {
//       this.logger.error(`Order creation failed: ${error.message}`, error.stack);
//       throw error;
//     }
//   }
// }


// import {
//   ConflictException,
//   Inject,
//   Injectable,
//   Logger,
//   NotFoundException,
// } from '@nestjs/common';
// import {
//   CreateOrderDto,
//   OrderItemDto,
//   OrderResponseDto,
// } from './dto/order.dto';
// import { randomUUID } from 'crypto';
// import { InjectRepository } from '@nestjs/typeorm';
// import { IFilmsRepository } from '../repository/films.repository';
// import { Repository } from 'typeorm';
// import { Schedule } from '../entity/schedule.entity';

// @Injectable()
// export class OrderService {
//   private readonly logger = new Logger(OrderService.name);
  
//   constructor(
//     @Inject('IFilmsRepository')
//     private readonly filmsRepository: IFilmsRepository,

//     @InjectRepository(Schedule)
//     private readonly scheduleRepository: Repository<Schedule>,
//   ) {}

//   async create(tickets: CreateOrderDto['tickets']): Promise<OrderResponseDto> {
//     this.logger.log('Creating new order');

//     if (!tickets || tickets.length === 0) {
//       this.logger.warn('Order creation failed: no tickets provided');
//       throw new NotFoundException('No tickets provided');
//     }

//     const items: OrderItemDto[] = [];
//     const schedulesToUpdate: Schedule[] = [];

//     try {
//       for (const ticket of tickets) {
//         this.logger.debug(`Processing ticket for film: ${ticket.film}, session: ${ticket.session}`);

//         const film = await this.filmsRepository.findById(ticket.film);

//         if (!film) {
//           this.logger.warn(`Film not found: ${ticket.film}`);
//           throw new NotFoundException(`Film ${ticket.film} not found`);
//         }

//         const session = film.schedules.find((s) => s.id === ticket.session);
//         this.logger.debug(`Session search result: ${session ? 'found' : 'not found'}`);

//         console.log('Session search:', {
//           filmId: film.id,
//           sessionId: ticket.session,
//           available: film.schedules.map((s) => s.id),
//         });

//         if (!session) {
//           this.logger.warn(`Session not found: ${ticket.session} in film ${film.title}`);
//           throw new NotFoundException(
//             `Session ${ticket.session} not found in film ${film.title}`,
//           );
//         }

//         // Проверяем занятость места
//         const seatKey = `${ticket.row}:${ticket.seat}`;
//         const takenSeats = session.taken ? JSON.parse(session.taken) : [];
        
//         if (takenSeats.includes(seatKey)) {
//           this.logger.warn(`Seat already taken: ${seatKey} in session ${session.id}`);
//           throw new ConflictException(`Seat ${seatKey} already taken`);
//         }

//         // Обновляем список занятых мест
//         takenSeats.push(seatKey);
//         session.taken = JSON.stringify(takenSeats);
//         schedulesToUpdate.push(session);

//         items.push({
//           film: ticket.film,
//           session: ticket.session,
//           daytime: session.daytime,
//           row: ticket.row,
//           seat: ticket.seat,
//           price: session.price,
//           id: randomUUID(),
//         });
//       }

//       // Сохраняем все изменения в расписаниях одной транзакцией
//       if (schedulesToUpdate.length > 0) {
//         this.logger.log(`Updating ${schedulesToUpdate.length} schedules`);
//         await this.scheduleRepository.save(schedulesToUpdate);
//       }

//       this.logger.log(`Order created successfully with ${items.length} items`);
//       return {
//         total: items.length,
//         items,
//       };
//     } catch (error) {
//       this.logger.error(`Order creation failed: ${error.message}`, error.stack);
//       throw error;
//     }
//   }
// }


