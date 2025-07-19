import { Injectable } from '@nestjs/common';
import { IFilmsRepository } from './films.repository';
import { Film } from 'src/films/schemas/film.schema';

@Injectable()
export class InMemoryFilmsRepository implements IFilmsRepository {
  private films: Film[] = [
    // Пример данных в памяти
    {
      id: '1',
      title: 'Пример фильма',
      rating: 7.5,
      director: 'Режиссер',
      tags: ['драма', 'комедия'],
      about: 'О фильме',
      description: 'Описание фильма',
      image: 'image.jpg',
      cover: 'cover.jpg',
      schedule: [
        {
          id: '1',
          daytime: '12:00',
          hall: 1,
          rows: 10,
          seats: 100,
          price: 300,
          taken: [],
        },
      ],
    } as Film,
  ];

  async findAll(): Promise<Film[]> {
    return [...this.films];
  }

  async findById(id: string): Promise<Film | null> {
    return this.films.find((film) => film.id === id) || null;
  }
}
