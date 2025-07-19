import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Film, FilmSchema } from './schemas/film.schema';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Film.name, schema: FilmSchema, collection: 'films' },
    ]),
  ],
  exports: [
    MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
  ],
  controllers: [FilmsController],
  providers: [FilmsService],
})

// const useInMemory = process.env.USE_IN_MEMORY === 'true';

// @Module({
//   imports: [
//     MongooseModule.forFeature([{
//       name: Film.name,
//       schema: FilmSchema,
//       collection: 'films'
//     }])
//   ],
//   controllers: [FilmsController],
//   providers: [
//     FilmsService,
//     {
//       provide: 'IFilmsRepository',
//       useClass: useInMemory ? InMemoryFilmsRepository : MongoFilmsRepository
//     }
//   ],
//   exports: [FilmsService]
// })
export class FilmsModule {}
