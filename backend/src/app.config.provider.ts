// import 'dotenv/config'; // Импорт dotenv для загрузки переменных окружения из .env файла
// import { ConfigService } from '@nestjs/config'; // Импорт ConfigService для доступа к переменным окружения

// // Определение провайдера конфигурации
// export const configProvider = {
//   // Уникальный токен, под которым будет доступна конфигурация
//   provide: 'CONFIG',
//   // Фабричная функция, которая создает объект конфигурации
//   useFactory: (configService: ConfigService) => ({ //Фабричная функция получает ConfigService как зависимость.Использует ConfigService для чтения переменных окружения. Формирует структурированный объект конфигурации.
//     database: {
//       // Получаем драйвер БД из переменных окружения
//       driver: configService.get('DATABASE_DRIVER'),
//       // Конфигурация для PostgreSQL (если используется)
//       postgres: {
//         host: configService.get('POSTGRES_HOST'), // Хост PostgreSQL из переменных окружения
//         port: configService.get('POSTGRES_PORT'), // Порт PostgreSQL из переменных окружения
//       },
//       // Конфигурация для MongoDB (если используется)
//       mongodb: {
//         uri: configService.get('MONGO_URI'), // URI подключения к MongoDB из переменных окружения
//         dbName: configService.get('MONGO_DATABASE'), // Имя базы данных MongoDB из переменных окружения
//       },
//     },
//   }),
//   // Указываем зависимости, которые нужно внедрить в фабричную функцию
//   // Здесь мы зависим от ConfigService
//   inject: [ConfigService],
// };

// // Интерфейс для типизации объекта конфигурации
// export interface AppConfig {
//   database: {
//     driver: string; // Драйвер базы данных (например, 'postgres' или 'mongodb')
//     // Опциональная конфигурация для PostgreSQL
//     postgres?: {
//       host: string; // Хост сервера PostgreSQL
//       port: number; // Порт сервера PostgreSQL
//     };
//     // Опциональная конфигурация для MongoDB
//     mongodb?: {
//       uri: string; // Connection string для MongoDB
//       dbName: string; // Имя базы данных MongoDB
//     };
//   };
// }

