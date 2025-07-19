// import { Film } from 'src/films/schemas/film.schema';

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Film } from "src/entity/film.entity";
import { Repository } from "typeorm";

export interface IFilmsRepository {
  findAll(): Promise<Film[]>;
  findById(id: string): Promise<Film | null>;
}

@Injectable()
export class FilmsRepository implements IFilmsRepository {
  constructor(
    @InjectRepository(Film)
    private readonly repository: Repository<Film>,
  ) {}

  async findAll(): Promise<Film[]> {
    return this.repository.find({ 
      relations: ['schedules'],
      order: { title: 'ASC' } 
    });
  }

  async findById(id: string): Promise<Film | null> {
    return this.repository.findOne({ 
      where: { id },
      relations: ['schedules'] 
    });
  }
}