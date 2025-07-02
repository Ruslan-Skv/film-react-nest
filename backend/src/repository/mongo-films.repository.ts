import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IFilmsRepository } from './films.repository';
import { Film } from 'src/films/schemas/film.schema';

@Injectable()
export class MongoFilmsRepository implements IFilmsRepository {
  constructor(@InjectModel(Film.name) private readonly filmModel: Model<Film>) {}

  async findAll(): Promise<Film[]> {
    return this.filmModel.find().lean().exec();
  }

  async findById(id: string): Promise<Film | null> {
    return this.filmModel.findOne({ id }).exec();
  }
}