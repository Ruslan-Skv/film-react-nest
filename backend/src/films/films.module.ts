import { Module } from '@nestjs/common';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmsRepository } from 'src/repository/films.repository';
import { Film } from 'src/entity/film.entity';
import { Schedule } from 'src/entity/schedule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Film, Schedule])],
  controllers: [FilmsController],
  providers: [
    FilmsRepository,
    FilmsService,
    {
      provide: 'IFilmsRepository',
      useExisting: FilmsRepository,
    },
  ],
  exports: [FilmsService, FilmsRepository, 'IFilmsRepository'],
})
export class FilmsModule {}
