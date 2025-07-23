import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Импорт модуля конфигурации и сервиса для работы с переменными окружения
import { TypeOrmModule } from '@nestjs/typeorm'; // Импорт TypeORM модуля для интеграции с NestJS
// Импорт сущностей базы данных
import { Film } from 'src/entity/film.entity';
import { Schedule } from 'src/entity/schedule.entity';

// Декоратор @Module определяет модуль базы данных
@Module({
  imports: [
    // Асинхронная настройка подключения к базе данных
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Импортируем ConfigModule для доступа к переменным окружения. imports: [ConfigModule] - дает доступ к ConfigService
      inject: [ConfigService], // Указываем зависимости, которые нужно внедрить в фабричную функцию. inject: [ConfigService] - внедряет сервис конфигурации в фабрику
      useFactory: (config: ConfigService) => ({  // Фабричная функция, возвращающая конфигурацию подключения. Все параметры подключения получаются из переменных окружения через ConfigService.
        type: 'postgres', // Тип СУБД - PostgreSQL
        host: config.get('POSTGRES_HOST'), // Хост БД из переменных окружения
        port: config.get<number>('POSTGRES_PORT'), // Порт БД (с явным указанием типа number)
        username: config.get('POSTGRES_USERNAME'), // Имя пользователя БД
        password: config.get('POSTGRES_PASSWORD'), // Пароль пользователя БД
        database: config.get('POSTGRES_DATABASE'), // Имя базы данных
        entities: [Film, Schedule], // Регистрируемые сущности. [Film, Schedule] - регистрируются все сущности, которые будут использоваться. TypeORM будет создавать для них таблицы в БД
        synchronize: true, // Автоматическая синхронизация схемы БД (только для разработки!). Рекомендуется использовать миграции в production
        logging: true, // Включение логгирования SQL-запросов
      }),
    }),
    // Регистрация репозиториев для конкретных сущностей
    // Делает их доступными для инъекции в другие модули. При импорте DatabaseModule в другой модуль, там становятся доступны: @InjectRepository(Film), @InjectRepository(Schedule)
    TypeOrmModule.forFeature([Film, Schedule]),
  ],
  
  exports: [TypeOrmModule], // Экспортируем TypeOrmModule, чтобы репозитории были доступны в других модулях
})
export class DatabaseModule {}

//Почему app.get(DataSource) работает, хотя DataSource не экспортится? Когда вы используете TypeOrmModule.forRootAsync(), NestJS и @nestjs/typeorm автоматически создают и регистрируют DataSource в DI-контейнере. Это происходит "под капотом". Что делает TypeOrmModule.forRootAsync(): 1)Создаёт подключение к PostgreSQL через TypeORM, 2)Создаёт экземпляр DataSource (из typeorm), 3)Регистрирует его в DI-контейнере NestJS неявно. Вывод: DataSource доступен через app.get(), даже если он не указан в exports модуля, потому что TypeOrmModule регистрирует его глобально.
