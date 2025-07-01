import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Film } from './schemas/film.schema';
import { Model } from 'mongoose';
import { FilmItemDto, FilmResponseDto } from './dto/film.dto';
import { ScheduleResponseDto, SessionDto } from './dto/schedule.dto';

@Injectable()
export class FilmsService {
  constructor(@InjectModel(Film.name) private filmModel: Model<Film>) {}
    
  async findAll(): Promise<FilmResponseDto> {
    const films = await this.filmModel.find().lean().exec();
    console.log('Raw films data:', films);

    const items: FilmItemDto[] = films.map(film => ({
      id: film.id,
      // id: film._id.toString(),
      rating: film.rating,
      director: film.director,
      tags: film.tags,
      title: film.title,
      about: film.about,
      description: film.description,
      image: film.image,
      cover: film.cover
      // image: `/content/afisha${film.image}`,
      // cover: `/content/afisha${film.cover}`
    }));

    return {
      total: items.length,
      items
    };
  }

 async getSchedule(id: string): Promise<ScheduleResponseDto> {
    const film = await this.filmModel.findOne({ id }).exec();
    if (!film) {
      throw new NotFoundException('Film not found');
    }
    
    const items: SessionDto[] = film.schedule.map(session => ({
      id: session.id,
      daytime: session.daytime,
      hall: session.hall,
      rows: session.rows,
      seats: session.seats,
      price: session.price,
      taken: session.taken
    }));

    return {
      total: items.length,
      items
    };
  }
}

