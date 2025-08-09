import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Film } from '../entity/film.entity';
import { Schedule } from '../entity/schedule.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('POSTGRES_HOST'),
        port: config.get<number>('POSTGRES_PORT'),
        username: config.get('POSTGRES_USER'),
        password: config.get('POSTGRES_PASSWORD'),
        database: config.get('POSTGRES_DB'),
        entities: [Film, Schedule],
        // synchronize: true,
        // logging: true,
        // synchronize: process.env.NODE_ENV !== 'production', // Отключаем для production
        // logging: process.env.NODE_ENV === 'dev',
        // ssl: process.env.NODE_ENV === 'production' ? { 
        //   rejectUnauthorized: false 
        // } : false,
        synchronize: config.get('NODE_ENV') !== 'production',
        logging: config.get('LOGGER_TYPE') === 'dev',
        poolSize: 10,
        extra: {
          connectionTimeoutMillis: 5000,
        }
      }),
    }),
    TypeOrmModule.forFeature([Film, Schedule]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
