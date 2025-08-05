import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import { LoggerFactory } from './logging/logger.factory';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  // Инициализируем логгер
  const loggerType = process.env.LOGGER_TYPE as 'dev' | 'json' | 'tskv' || 'dev';
  const logger = LoggerFactory.create(loggerType);

  app.setGlobalPrefix('api/afisha');
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  app.useLogger(logger);
  app.useGlobalPipes(new ValidationPipe());

  try {
    // Проверка подключения к БД
    logger.log('Starting application initialization...');
    if (process.env.DATABASE_DRIVER === 'postgres') {
      logger.log('Checking PostgreSQL connection...');
      const dataSource = app.get(DataSource);
      await dataSource.query('SELECT 1');
      logger.log('PostgreSQL connected successfully');
    } else if (process.env.DATABASE_DRIVER === 'mongodb') {
      logger.log('Checking MongoDB connection...');
      const connection = app.get<Connection>(getConnectionToken());
      await connection.db.admin().ping();
      logger.log('MongoDB connected successfully');
    } else {
      logger.warn('No database driver specified in environment variables');
    }

    await app.listen(3000);
    logger.log(`Application is running on: http://localhost:3000/api/afisha`);
    logger.debug(`Logger type: ${loggerType}`);
    logger.debug(`NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
  } catch (error) {
    logger.error('Application startup failed', error instanceof Error ? error.stack : error);
    process.exit(1);
  }
}
bootstrap();


