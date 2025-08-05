import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Film } from 'src/entity/film.entity';
import { Repository } from 'typeorm';

export interface IFilmsRepository {
  findAll(): Promise<Film[]>;
  findById(id: string): Promise<Film | null>;
}

@Injectable()
export class FilmsRepository implements IFilmsRepository {
  private readonly logger = new Logger(FilmsRepository.name);
  constructor(
    @InjectRepository(Film)
    private readonly filmRepository: Repository<Film>,
  ) {}

  async findAll(): Promise<Film[]> {
    this.logger.log('Fetching all films with schedules');
    try {
      const films = await this.filmRepository.find({
        relations: ['schedules'],
        order: { title: 'ASC' },
      });
      
      this.logger.debug(`Found ${films.length} films`);
      return films;
    } catch (error) {
      this.logger.error('Failed to fetch films', error.stack);
      throw error;
    }
  }

  async findById(id: string): Promise<Film | null> {
    this.logger.log(`Fetching film by ID: ${id}`);
    try {
      const film = await this.filmRepository.findOne({
        where: { id },
        relations: ['schedules'],
      });

      if (!film) {
        this.logger.warn(`Film with ID ${id} not found`);
      } else {
        this.logger.debug(`Found film: ${film.title} with ${film.schedules?.length || 0} schedules`);
      }

      return film;
    } catch (error) {
      this.logger.error(`Failed to fetch film by ID: ${id}`, error.stack);
      throw error;
    }
  }
}
