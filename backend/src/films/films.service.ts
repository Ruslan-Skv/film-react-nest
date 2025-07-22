import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FilmItemDto, FilmResponseDto } from './dto/film.dto';
import { ScheduleResponseDto, SessionDto } from './dto/schedule.dto';
import { IFilmsRepository } from 'src/repository/films.repository';

@Injectable()
export class FilmsService {
  constructor(
    @Inject('IFilmsRepository')
    private readonly filmRepository: IFilmsRepository,
  ) {}

  async findAll(): Promise<FilmResponseDto> {
    const films = await this.filmRepository.findAll();
    console.log('Raw films data:', films);

    const items: FilmItemDto[] = films.map((film) => ({
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: film.tags,
      title: film.title,
      about: film.about,
      description: film.description,
      image: film.image,
      cover: film.cover,
    }));

    return {
      total: items.length,
      items,
    };
  }

  async findById(id: string): Promise<ScheduleResponseDto> {
    const film = await this.filmRepository.findById(id);
    if (!film) {
      throw new NotFoundException('Film not found');
    }

    const items: SessionDto[] = film.schedules.map((session) => ({
      id: session.id,
      daytime: session.daytime,
      hall: session.hall,
      rows: session.rows,
      seats: session.seats,
      price: session.price,
      taken: session.taken,
    }));

    return {
      total: items.length,
      items,
    };
  }
}
