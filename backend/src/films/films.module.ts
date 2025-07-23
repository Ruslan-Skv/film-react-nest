import { Module } from '@nestjs/common';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { TypeOrmModule } from '@nestjs/typeorm'; // Импорт модуля TypeORM для интеграции с базой данных
import { FilmsRepository } from 'src/repository/films.repository'; // Импорт репозитория для работы с данными фильмов
import { Film } from 'src/entity/film.entity';
import { Schedule } from 'src/entity/schedule.entity';

@Module({
  // Регистрация сущностей Film и Schedule в TypeORM
  // Это позволяет использовать их в репозиториях внутри модуля
  imports: [TypeOrmModule.forFeature([Film, Schedule])],
  controllers: [FilmsController], // Контроллеры, которые принадлежат этому модулю
  providers: [
    FilmsService, // Сервис для бизнес-логики фильмов
    FilmsRepository, //  Конкретная реализация Репозитория для работы с фильмами
    {
      // Определение кастомного провайдера с интерфейсом IFilmsRepository
      // Это позволяет использовать абстракцию (интерфейс) вместо конкретной реализации
      provide: 'IFilmsRepository',  // Токен для инъекции.  //Это означает: "Когда кто-то запросит IFilmsRepository, используй FilmsRepository".
      useExisting: FilmsRepository,  // Использовать существующий экземпляр FilmsRepository, //Почему именно useExisting: В вашем коде используется useExisting (а не useClass или useValue), потому что: FilmsRepository уже зарегистрирован как провайдер выше в списке. Это позволяет использовать один и тот же экземпляр репозитория для всех зависимостей
    },
  ],
  exports: [FilmsService, FilmsRepository, 'IFilmsRepository'],   // Экспортируемые провайдеры - они станут доступны другим модулям, которые импортируют этот модуль
})
export class FilmsModule {}
