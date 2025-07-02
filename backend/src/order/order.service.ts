import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateOrderDto,
  OrderItemDto,
  OrderResponseDto,
} from './dto/order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Film } from 'src/films/schemas/film.schema';
import { Model } from 'mongoose';
import { randomUUID } from 'crypto';

@Injectable()
export class OrderService {
    constructor(@InjectModel(Film.name) private filmModel: Model<Film>) {}

    async create(tickets: CreateOrderDto['tickets']): Promise<OrderResponseDto> {
    if (!tickets || tickets.length === 0) {
        throw new NotFoundException('No tickets provided');
    }

    const items: OrderItemDto[] = [];

    for (const ticket of tickets) {
        const film = await this.filmModel.findOne({ id: ticket.film }).exec();
        if (!film) {
            throw new NotFoundException(`Film ${ticket.film} not found`);
        }

        const session = film.schedule.find(s => s.id === ticket.session);
        console.log('Session search:', {
            filmId: film.id,
            sessionId: ticket.session,
            available: film.schedule.map(s => s.id)
        });

        if (!session) {
            throw new NotFoundException(`Session ${ticket.session} not found in film ${film.title}`);
        }

        const seatKey = `${ticket.row}:${ticket.seat}`;
        if (session.taken.includes(seatKey)) {
            throw new ConflictException(`Seat ${seatKey} already taken`);
        }

        session.taken.push(seatKey);
        await film.save();

        items.push({
            film: ticket.film,
            session: ticket.session,
            daytime: ticket.daytime,
            row: ticket.row,
            seat: ticket.seat,
            price: ticket.price,
            id: randomUUID(),
        });
    }

    return {
        total: items.length,
        items,
    };
    }
}
