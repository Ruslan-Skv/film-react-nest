import { Schedule } from '../entity/schedule.entity';
import { Film } from '../entity/film.entity';
import { CreateOrderDto, OrderItemDto, OrderResponseDto, TicketDto } from '../order/dto/order.dto';

export const mockSchedule: Schedule = {
  id: 'session-1',
  daytime: '2023-01-01T14:00:00',
  hall: 1,
  rows: 10,
  seats: 20,
  price: 500,
  taken: [],
  film: {} as Film,
};

export const mockFilm: Film = {
  id: 'film-1',
  title: 'Test Film',
  schedules: [mockSchedule],
} as Film;

export const mockTicket: TicketDto = {
  film: 'film-1',
  session: 'session-1',
  daytime: '2023-01-01T14:00:00',
  row: 1,
  seat: 5,
  price: 500
};

export const mockCreateOrderDto: CreateOrderDto = {
  email: 'test@example.com',
  phone: '+79998887766',
  tickets: [mockTicket]
};

export const mockOrderItem: OrderItemDto = {
  id: expect.any(String),
  film: 'film-1',
  session: 'session-1',
  daytime: '2023-01-01T14:00:00',
  row: 1,
  seat: 5,
  price: 500
};

export const mockOrderResponse: OrderResponseDto = {
  total: 1,
  items: [mockOrderItem]
};