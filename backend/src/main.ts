import { NestFactory } from '@nestjs/core'; // Основной класс для создания NestJS приложения
import { AppModule } from './app.module'; // Корневой модуль приложения
import 'dotenv/config'; // Загрузка переменных окружения из .env файла
import { ValidationPipe } from '@nestjs/common'; // Pipe для валидации входящих данных
import { DataSource } from 'typeorm'; // Источник данных для TypeORM (PostgreSQL)
import { Connection } from 'mongoose'; // Подключение для Mongoose (MongoDB)
import { getConnectionToken } from '@nestjs/mongoose'; // Утилита для получения токена подключения MongoDB

// Основная асинхронная функция для запуска приложения
async function bootstrap() {
  // Создаем экземпляр приложения NestJS, передавая корневой модуль
  const app = await NestFactory.create(AppModule);
  // Устанавливаем глобальный префикс для всех маршрутов API
  app.setGlobalPrefix('api/afisha');
  // Настраиваем CORS (Cross-Origin Resource Sharing) для безопасности
  app.enableCors({
    origin: 'http://localhost:5173', // Разрешаем запросы только с этого origin
    credentials: true, // Разрешаем передачу учетных данных (куки, авторизация)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Разрешенные HTTP методы
  });
  // Глобально применяем ValidationPipe для автоматической валидации входящих данных
  app.useGlobalPipes(new ValidationPipe());

  try {
    // Проверка подключения к БД перед запуском приложения
    if (process.env.DATABASE_DRIVER === 'postgres') {
      // Если используется PostgreSQL (TypeORM)
      const dataSource = app.get(DataSource); // Получаем источник данных. DataSource - класс из TypeORM, представляющий подключение к PostgreSQL (или другой SQL-базе).
      await dataSource.query('SELECT 1'); // Простой запрос для проверки подключения, который не обращается к таблицам, а просто возвращает число 1
      console.log('PostgreSQL connected successfully');
    } else if (process.env.DATABASE_DRIVER === 'mongodb') {
      // Если используется MongoDB (Mongoose)
      const connection = app.get<Connection>(getConnectionToken()); // Получаем соединение
      await connection.db.admin().ping(); // Проверяем подключение с помощью ping. Если сервер доступен, он возвращает ответ в формате: { "ok": 1 }
      console.log('MongoDB connected successfully');
    }

    // Запускаем приложение на порту 3000
    await app.listen(3000);
    console.log(`Server running on http://localhost:3000/api/afisha`);
  } catch (error) {
    // Обработка ошибок при запуске приложения
    console.error('Application startup error:', error);
    process.exit(1); // Завершаем процесс с кодом ошибки
  }
}

// Вызываем функцию bootstrap для запуска приложения
bootstrap();
