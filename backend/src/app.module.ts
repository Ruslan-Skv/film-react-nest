import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
// import { configProvider } from './app.config.provider';
import { join } from 'path';
import { FilmsModule } from './films/films.module';
import { OrdersModule } from './order/orders.module';
import { DatabaseModule } from './database/database.module';
import { MongooseModule } from '@nestjs/mongoose';

// Динамический выбор модуля базы данных в зависимости от переменной окружения
// Если DATABASE_DRIVER равен 'mongodb', используем MongooseModule для подключения к MongoDB
// В противном случае используем кастомный DatabaseModule
const databaseModule = process.env.DATABASE_DRIVER === 'mongodb' 
  ? MongooseModule.forRoot(process.env.MONGO_URI, {  // Настройка подключения к MongoDB
      dbName: process.env.MONGO_DATABASE,  // Имя базы данных из переменных окружения
    })
  : DatabaseModule;  // Альтернативный модуль для работы с СУБД POSTGRES


@Module({
  imports: [
    // Настройка модуля конфигурации для работы с переменными окружения
    ConfigModule.forRoot({
      isGlobal: true,  // Делаем модуль глобальным (доступен во всем приложении)
      cache: true,  // Включаем кэширование переменных окружения
      envFilePath: '.env',  // Указываем путь к файлу .env
    }),
    databaseModule, // Подключение выбранного модуля базы данных
    // Настройка модуля для раздачи статических файлов
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),  // Путь к папке со статическими файлами
      serveRoot: '/',  // Базовый URL для статических файлов
      exclude: ['/api/*'],  // Исключаем маршруты API из обработки статических файлов
      serveStaticOptions: {
        maxAge: 86400000, // Время кэширования в миллисекундах (1 день)
        cacheControl: true,  // Включаем заголовки Cache-Control
      },
    }),
    // Подключение функциональных модулей приложения
    FilmsModule,
    OrdersModule,
  ],
  controllers: [],  // Контроллеры уровня модуля (в данном случае отсутствуют)
  // providers: [configProvider],  // Провайдеры уровня модуля (здесь - провайдер конфигурации)
})
export class AppModule {}
