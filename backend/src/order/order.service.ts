import {
  ConflictException, // Для конфликтующих операций (HTTP 409)
  Inject, // Для внедрения зависимостей
  Injectable, // Пометка класса как инжектируемого сервиса
  NotFoundException, // Для отсутствующих ресурсов (HTTP 404)
} from '@nestjs/common';
import {
  CreateOrderDto, // DTO для создания заказа
  OrderItemDto, // DTO для элемента заказа
  OrderResponseDto, // DTO для ответа с заказом
} from './dto/order.dto';
import { randomUUID } from 'crypto'; // Импорт функции генерации UUID
import { InjectRepository } from '@nestjs/typeorm'; // Импорт декоратора для TypeORM репозиториев
import { IFilmsRepository } from 'src/repository/films.repository'; // Импорт интерфейса репозитория фильмов
import { Repository } from 'typeorm'; // Импорт TypeORM репозитория
import { Schedule } from 'src/entity/schedule.entity'; // Импорт сущности расписания

@Injectable()  // Декоратор, помечающий класс как провайдер NestJS
export class OrderService {
  constructor(
    // Внедрение репозитория фильмов через интерфейс
    @Inject('IFilmsRepository')
    private readonly filmsRepository: IFilmsRepository,

    // Внедрение TypeORM репозитория для работы с расписаниями
    // Декоратор @InjectRepository автоматически создает репозиторий (предоставляет TypeORM репозиторий) для сущности Schedule
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  // Метод создания заказа
  async create(tickets: CreateOrderDto['tickets']): Promise<OrderResponseDto> {
    // Проверка наличия билетов в заказе
    if (!tickets || tickets.length === 0) {
      throw new NotFoundException('No tickets provided');
    }

    // 1. Собираем все уникальные ID фильмов из заказа
    const filmIds = [...new Set(tickets.map(ticket => ticket.film))];

    // 2. Загружаем ВСЕ необходимые фильмы с расписаниями ОДНИМ запросом
    const films = await this.filmsRepository.findManyByIds(filmIds);

    // 3. Создаем карту фильмов для быстрого доступа по ID
    const filmsMap = new Map(films.map(film => [film.id, film]));

    const items: OrderItemDto[] = [];  // Массив для хранения созданных билетов
    const schedulesToUpdate: Schedule[] = [];  // Массив для расписаний, требующих обновления

    // Обработка каждого билета в заказе
    for (const ticket of tickets) {
      // Находим фильм с расписанием
      // const film = await this.filmsRepository.findById(ticket.film);
      // 4. Получаем фильм из карты (O(1) сложность)
      const film = filmsMap.get(ticket.film);

      // Проверка существования фильма
      if (!film) {
        throw new NotFoundException(`Film ${ticket.film} not found`);
      }

      // Находим конкретный сеанс в расписании фильма
      const session = film.schedules.find((s) => s.id === ticket.session);

      // Проверка существования сеанса
      if (!session) {
        throw new NotFoundException(
          `Session ${ticket.session} not found in film ${film.title}`,
        );
      }

      // Формирование ключа места (ряд:место)
      const seatKey = `${ticket.row}:${ticket.seat}`;
      // Проверка, не занято ли место
      if (session.taken.includes(seatKey)) {
        throw new ConflictException(`Seat ${seatKey} already taken`);
      }

      // Резервирование места (добавление в массив занятых)
      session.taken = [...session.taken, seatKey];
      schedulesToUpdate.push(session);  // Добавляем сеанс для обновления в БД

      // Создание DTO для билета
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

    // Возврат структурированного ответа
    return {
      total: items.length, // Общее количество билетов
      items, // Массив созданных билетов
    };
  }
}

// Реализована рекомендация ревьюера по: // Находим фильм с расписанием const film = await this.filmsRepository.findById(ticket.film); можно лучше. У Вас здесь происходит перебор массива и на каждое значение запрос отдельный в БД, можно лучше - сразу запросить фильмы по массиву идентификаторов const films = this.filmsRepository.find({id: {$in: filmIds}}); и это будет самым оптимальным решением, мы одним запросом получим сразу все фильмы, а не отдельным запросом по каждому фильму в БД ходить


// @Injectable()  // Декоратор, помечающий класс как провайдер NestJS
// export class OrderService {
//   constructor(
//     // Внедрение репозитория фильмов через интерфейс
//     @Inject('IFilmsRepository')
//     private readonly filmsRepository: IFilmsRepository,

//     // Внедрение TypeORM репозитория для работы с расписаниями
//     // Декоратор @InjectRepository автоматически создает репозиторий (предоставляет TypeORM репозиторий) для сущности Schedule
//     @InjectRepository(Schedule)
//     private readonly scheduleRepository: Repository<Schedule>,
//   ) {}

//   // Метод создания заказа
//   async create(tickets: CreateOrderDto['tickets']): Promise<OrderResponseDto> {
//     // Проверка наличия билетов в заказе
//     if (!tickets || tickets.length === 0) {
//       throw new NotFoundException('No tickets provided');
//     }

//     const items: OrderItemDto[] = [];  // Массив для хранения созданных билетов
//     const schedulesToUpdate: Schedule[] = [];  // Массив для расписаний, требующих обновления

//     // Обработка каждого билета в заказе
//     for (const ticket of tickets) {
//       // Находим фильм с расписанием
//       const film = await this.filmsRepository.findById(ticket.film);

//       // Проверка существования фильма
//       if (!film) {
//         throw new NotFoundException(`Film ${ticket.film} not found`);
//       }
      
//       // Находим конкретный сеанс в расписании фильма
//       const session = film.schedules.find((s) => s.id === ticket.session);

//       // Проверка существования сеанса
//       if (!session) {
//         throw new NotFoundException(
//           `Session ${ticket.session} not found in film ${film.title}`,
//         );
//       }

//       // Формирование ключа места (ряд:место)
//       const seatKey = `${ticket.row}:${ticket.seat}`;
//       // Проверка, не занято ли место
//       if (session.taken.includes(seatKey)) {
//         throw new ConflictException(`Seat ${seatKey} already taken`);
//       }

//       // Резервирование места (добавление в массив занятых)
//       session.taken = [...session.taken, seatKey];
//       schedulesToUpdate.push(session);  // Добавляем сеанс для обновления в БД

//       // Создание DTO для билета
//       items.push({
//         film: ticket.film,
//         session: ticket.session,
//         daytime: session.daytime, // Берем из расписания
//         row: ticket.row,
//         seat: ticket.seat,
//         price: session.price, // Берем из расписания
//         id: randomUUID(),
//       });
//     }

//     // Сохраняем все изменения в расписаниях одной транзакцией
//     if (schedulesToUpdate.length > 0) {
//       await this.scheduleRepository.save(schedulesToUpdate);
//     }

//     // Возврат структурированного ответа
//     return {
//       total: items.length, // Общее количество билетов
//       items, // Массив созданных билетов
//     };
//   }
// }