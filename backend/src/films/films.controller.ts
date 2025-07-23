import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmResponseDto } from './dto/film.dto';
import { ScheduleResponseDto } from './dto/schedule.dto';

// Декоратор @Controller определяет класс как контроллер и задает базовый путь '/films'
@Controller('films')
export class FilmsController {
  // Конструктор с внедрением зависимости FilmsService
  // NestJS автоматически создаст и передаст экземпляр FilmsService
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  async getAllFilms(): Promise<FilmResponseDto> {
    console.log('Получение всех фильмов');
    // Вызов метода сервиса для получения всех фильмов
    // Сервис возвращает данные в формате FilmResponseDto
    return this.filmsService.findAll();
  }

  // Декоратор @Get с параметром означает обработку GET-запросов вида /films/:id/schedule
  @Get(':id/schedule')
  async getFilmSchedule(@Param('id') id: string): Promise<ScheduleResponseDto> {
    // Валидация параметра запроса
    if (!id) {
      // Если ID не передан, выбрасываем исключение с HTTP-статусом 400
      throw new BadRequestException('Film ID is required');
    }
    console.log('Получение сеансов фильма');
    // Вызов метода сервиса для получения расписания конкретного фильма
    // Сервис возвращает данные в формате ScheduleResponseDto
    return this.filmsService.findById(id);
  }
}
