import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
class Session {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  daytime: string;  // Время сеанса (например, "14:00")

  @Prop({ required: true })
  hall: number;  // Номер зала

  @Prop({ required: true })
  rows: number;  // Количество рядов в зале

  @Prop({ required: true })
  seats: number;  // Количество мест в ряду

  @Prop({ required: true })
  price: number;  // Цена билета

  @Prop({ type: [String], default: [] })
  taken: string[];  // Массив занятых мест
}

@Schema({ collection: 'films' })
export class Film extends Document {
  @Prop({ required: true, unique: true })
  id: string;  // Уникальный ID фильма

  @Prop({ required: true })
  title: string;  // Название фильма

  @Prop({ required: true })
  director: string;  // Режиссёр

  @Prop({ required: true })
  rating: number;  // Рейтинг

  @Prop({ type: [String], required: true })
  tags: string[];  // Жанры

  @Prop({ required: true })
  about: string;  // Краткое описание

  @Prop({ required: true })
  description: string;  // Полное описание

  @Prop({ required: true })
  image: string;  // URL постера

  @Prop({ required: true })
  cover: string;  // URL обложки

  @Prop({ type: [Session], required: true })
  schedule: Session[];  // Массив сеансов
}

export const FilmSchema = SchemaFactory.createForClass(Film);