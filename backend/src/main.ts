import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/afisha');
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  app.useGlobalPipes(new ValidationPipe());

  try {
    // Проверка подключения к БД
    if (process.env.DATABASE_DRIVER === 'postgres') {
      const dataSource = app.get(DataSource);
      await dataSource.query('SELECT 1');
      console.log('PostgreSQL connected successfully');
    } else if (process.env.DATABASE_DRIVER === 'mongodb') {
      const connection = app.get<Connection>(getConnectionToken());
      await connection.db.admin().ping();
      console.log('MongoDB connected successfully');
    }

    await app.listen(3000);
    console.log(`Server running on http://localhost:3000/api/afisha`);
  } catch (error) {
    console.error('Application startup error:', error);
    process.exit(1);
  }
}
bootstrap();




// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   app.setGlobalPrefix('api/afisha');
//   app.enableCors({
//     origin: 'http://localhost:5173',
//     credentials: true,
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   });
//   app.useGlobalPipes(new ValidationPipe());
//   // await app.listen(3000);
//   try {
//     await app.listen(3000);
//     console.log('Connected to PostgreSQL database');
//   } catch (error) {
//     console.error('Database connection error:', error);
//   }
// }
// bootstrap();
