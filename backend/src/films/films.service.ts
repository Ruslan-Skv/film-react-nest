import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { FilmItemDto, FilmResponseDto } from './dto/film.dto';
import { ScheduleResponseDto, SessionDto } from './dto/schedule.dto';
import { IFilmsRepository } from 'src/repository/films.repository';

@Injectable()
export class FilmsService {
  private readonly logger = new Logger(FilmsService.name);
  constructor(
    @Inject('IFilmsRepository')
    private readonly filmRepository: IFilmsRepository,
  ) {}

  async findAll(): Promise<FilmResponseDto> {
    this.logger.log('Fetching all films');
    try {
      const films = await this.filmRepository.findAll();
      this.logger.debug(`Found ${films.length} films`);

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

      this.logger.log('Successfully processed films data');
      return {
        total: items.length,
        items,
      };
    } catch (error) {
      this.logger.error('Failed to fetch films', error.stack);
      throw error;
    }
  }

  async findById(id: string): Promise<ScheduleResponseDto> {
    this.logger.log(`Fetching film schedule for ID: ${id}`);
    try {
      const film = await this.filmRepository.findById(id);
      if (!film) {
        this.logger.warn(`Film not found with ID: ${id}`);
        throw new NotFoundException('Film not found');
      }

      this.logger.debug(`Found film: ${film.title} with ${film.schedules?.length || 0} schedules`);

      const items: SessionDto[] = film.schedules.map((session) => ({
        id: session.id,
        daytime: session.daytime,
        hall: session.hall,
        rows: session.rows,
        seats: session.seats,
        price: session.price,
        taken: session.taken,
      }));

      this.logger.log(`Successfully processed schedules for film ID: ${id}`);
      return {
        total: items.length,
        items,
      };
    }  catch (error) {
      this.logger.error(`Failed to fetch film schedule for ID: ${id}`, error.stack);
      throw error;
    }
  }
}
