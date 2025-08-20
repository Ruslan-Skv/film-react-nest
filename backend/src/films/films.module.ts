import { Logger, Module } from '@nestjs/common';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmsRepository } from '../repository/films.repository';
import { Film } from '../entity/film.entity';
import { Schedule } from '../entity/schedule.entity';

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
    {
      provide: 'FILMS_MODULE_LOGGER',
      useValue: new Logger('FilmsModule'),
    },
  ],
  exports: [FilmsService, FilmsRepository, 'IFilmsRepository'],
})
export class FilmsModule {
   private readonly logger = new Logger(FilmsModule.name);

  constructor() {
    this.logger.log('Films module initialized');
  }
}
