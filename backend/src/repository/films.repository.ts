import { Film } from "src/films/schemas/film.schema";

export interface IFilmsRepository {
  findAll(): Promise<Film[]>;
  findById(id: string): Promise<Film | null>;
}
