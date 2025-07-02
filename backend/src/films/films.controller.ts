import { BadRequestException, Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmResponseDto } from './dto/film.dto';
import { ScheduleResponseDto } from './dto/schedule.dto';
// import { CreateFilmDto } from './dto/films.dto';

@Controller('films')
export class FilmsController {
    constructor(private readonly filmsService: FilmsService) {};
    
    @Get()
  async getAllFilms(): Promise<FilmResponseDto> {
    console.log('Получение всех фильмов');
    return this.filmsService.findAll();
  }

    @Get(':id/schedule')
  async getFilmSchedule(@Param('id') id: string): Promise<ScheduleResponseDto> {
    if (!id) {
      throw new BadRequestException('Film ID is required');
    }
    console.log('Получение сеансов фильма');
    return this.filmsService.getSchedule(id);
  }
}