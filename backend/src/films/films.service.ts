import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FilmItemDto, FilmResponseDto } from './dto/film.dto';
import { ScheduleResponseDto, SessionDto } from './dto/schedule.dto';
import { IFilmsRepository } from 'src/repository/films.repository'; // Импорт интерфейса репозитория фильмов

// Декоратор @Injectable указывает, что класс может быть инжектирован как зависимость
@Injectable()
export class FilmsService {
  // Конструктор класса с внедрением зависимостей
  constructor(
    // Внедрение репозитория фильмов через интерфейс IFilmsRepository
    // Используется декоратор @Inject с токеном 'IFilmsRepository'
    //Как это работает в рантайме: 1)Когда NestJS создаёт экземпляр FilmsService, он видит декоратор @Inject, 2)DI-система ищет провайдер с токеном 'IFilmsRepository', 3)Находит связку useExisting: FilmsRepository, 4)Внедряет экземпляр FilmsRepository в сервис
    //Преимущества такого подхода: Слабая связанность: 1)Сервис зависит только от абстракции (интерфейса), а не от конкретной реализации, 2)Можно легко заменить реализацию репозитория (например, на мок для тестов)
    //реализация с @Inject('IFilmsRepository') - это лучшая практика, которая: Делает код более поддерживаемым, Упрощает тестирование, Позволяет легко менять реализации, Чётко разделяет контракты и реализацию
    @Inject('IFilmsRepository') //@Inject('IFilmsRepository') - указывает, что нужно внедрить реализацию, зарегистрированную под этим токеном
    private readonly filmRepository: IFilmsRepository, //IFilmsRepository - тип интерфейса для TypeScript (проверка типов)
  ) {}

  // Метод для получения всех фильмов
  async findAll(): Promise<FilmResponseDto> {
    // Получение всех фильмов из репозитория
    const films = await this.filmRepository.findAll();
    // Логирование сырых данных для отладки
    console.log('Raw films data:', films);

    // Преобразование данных фильмов в DTO
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

    // Возвращение структурированного ответа
    return {
      total: items.length, // Общее количество фильмов
      items, // Массив фильмов
    };
  }

  // Метод для получения расписания сеансов конкретного фильма по ID
  async findById(id: string): Promise<ScheduleResponseDto> {
    // Поиск фильма по ID в репозитории
    const film = await this.filmRepository.findById(id);
    // Если фильм не найден, выбрасываем исключение
    if (!film) {
      throw new NotFoundException('Film not found');
    }

    // Преобразование данных сеансов в DTO
    const items: SessionDto[] = film.schedules.map((session) => ({
      id: session.id,
      daytime: session.daytime,
      hall: session.hall,
      rows: session.rows,
      seats: session.seats,
      price: session.price,
      taken: session.taken,
    }));

    // Возвращение структурированного ответа с расписанием
    return {
      total: items.length, // Общее количество сеансов
      items, // Массив сеансов
    };
  }
}
