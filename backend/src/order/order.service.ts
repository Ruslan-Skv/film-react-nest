import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Film } from 'src/films/schemas/film.schema';
import { Model } from 'mongoose';

@Injectable()
export class OrderService {
  constructor(@InjectModel(Film.name) private filmModel: Model<Film>) {}

   async create(order: CreateOrderDto) {
        // Логика бронирования
        const film = await this.filmModel.findOne({ id: order.film }).exec();
        const session = film.schedule.find(s => s.id === order.session);

        if (!session) {
            throw new Error('Session not found');
        }

        const seatKey = `${order.row}:${order.seat}`;
        if (session.taken.includes(seatKey)) {
            throw new Error('Seat already taken');
        }

        session.taken.push(seatKey);
        await film.save();

        return {
            success: true,
            filmId: order.film,
            sessionId: order.session,
            daytime: order.daytime,
            row: order.row,
            seat: order.seat,
            price: order.price,
            bookingId: `booking-${Math.random().toString(36).substr(2, 9)}`
        };
    }
}
