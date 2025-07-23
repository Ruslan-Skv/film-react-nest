import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Film } from 'src/entity/film.entity';
import { In, Repository } from 'typeorm';

// Определение интерфейса репозитория
// Это контракт, который определяет какие методы должен реализовывать репозиторий
export interface IFilmsRepository {
  findAll(): Promise<Film[]>; // Метод для получения всех фильмов
  findById(id: string): Promise<Film | null>; // Метод для поиска фильма по ID
  findManyByIds(ids: string[]): Promise<Film[]>; // Новый метод
}

// export interface IFilmsRepository {
//   findAll(): Promise<Film[]>; // Метод для получения всех фильмов
//   findById(id: string): Promise<Film | null>; // Метод для поиска фильма по ID
// }

// Декоратор @Injectable() - помечает класс как провайдер,  который может быть внедрен как зависимость
@Injectable()
export class FilmsRepository implements IFilmsRepository {
  // Конструктор класса с внедрением зависимостей
  constructor(
    // Внедрение TypeORM репозитория для сущности Film
    // Декоратор @InjectRepository автоматически создает репозиторий (предоставляет TypeORM репозиторий) для сущности Film
    @InjectRepository(Film)
    private readonly filmRepository: Repository<Film>,  // Инстанс TypeORM репозитория
  ) {}

  // Реализация метода findAll из интерфейса
  async findAll(): Promise<Film[]> {
    // Использование TypeORM метода find() с опциями:
    return this.filmRepository.find({
      relations: ['schedules'],  // Загружаем связанные сущности расписаний
      order: { title: 'ASC' },  // Сортировка по названию фильма (A-Z)
    });
  }

  // Реализация метода findById из интерфейса
  async findById(id: string): Promise<Film | null> {
    // Использование TypeORM метода findOne() с опциями:
    return this.filmRepository.findOne({
      where: { id }, // Условие поиска по ID
      relations: ['schedules'], // Загружаем связанные сущности расписаний
    });
  }

  //Реализован новый метод findManyByIds, который: Принимает массив ID фильмов, Использует оператор In для выборки всех фильмов одним запросом, Загружает связанные сущности расписаний
   async findManyByIds(ids: string[]): Promise<Film[]> {
    return this.filmRepository.find({
      where: { id: In(ids) }, // Используем оператор In
      relations: ['schedules'], // Загружаем связанные расписания
    });
  }
}

//TypeORM особенности: 1)Repository<T> - базовый класс TypeORM для работы с сущностями, 2)find() и findOne() - стандартные методы TypeORM для запросов, 3)relations - опция для загрузки связанных сущностей, 4)order - опция для сортировки результатов. Принципы SOLID: 1)Следование принципу Dependency Injection 2)Разделение интерфейса и реализации (D in SOLID) 3)Единственная ответственность (работа только с данными фильмов). Этот репозиторий: 1)Инкапсулирует всю логику работы с базой данных, 2)Предоставляет чистый интерфейс для сервисов 3)Легко поддается мокированию для тестов 4)Может быть заменен на другую реализацию без изменения кода сервисов
