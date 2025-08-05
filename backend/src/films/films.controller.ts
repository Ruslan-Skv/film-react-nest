import { BadRequestException, Controller, Get, Logger, Param } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmResponseDto } from './dto/film.dto';
import { ScheduleResponseDto } from './dto/schedule.dto';

@Controller('films')
export class FilmsController {
  private readonly logger = new Logger(FilmsController.name);

  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  async getAllFilms(): Promise<FilmResponseDto> {
    this.logger.log('Handling GET /films request');
    const startTime = Date.now();
    
    try {
      const result = await this.filmsService.findAll();
      const duration = Date.now() - startTime;
      this.logger.log(`GET /films completed in ${duration}ms`);
      return result;
    } catch (error) {
      this.logger.error(`GET /films failed: ${error.message}`);
      throw error;
    }
  }

  @Get(':id/schedule')
  async getFilmSchedule(@Param('id') id: string): Promise<ScheduleResponseDto> {
    this.logger.log(`Handling GET /films/${id}/schedule request`);
    
    if (!id) {
      this.logger.warn('Film ID is required');
      throw new BadRequestException('Film ID is required');
    }

    const startTime = Date.now();
    try {
      const result = await this.filmsService.findById(id);
      const duration = Date.now() - startTime;
      this.logger.log(`GET /films/${id}/schedule completed in ${duration}ms`);
      return result;
    } catch (error) {
      this.logger.error(`GET /films/${id}/schedule failed: ${error.message}`);
      throw error;
    }
  }
}
