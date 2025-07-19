import { Column, Entity, Index, OneToMany, PrimaryColumn } from "typeorm";
import { Schedule } from "./schedule.entity";

@Entity()
export class Film {
  @PrimaryColumn()
  id: string; // Уникальный ID фильма

  @Index()
  @Column({ length: 100 })
  title: string; // Название фильма

  @Column({ length: 50 })
  director: string; // Режиссёр

  @Column({ type: 'decimal', precision: 3, scale: 1 })
  rating: number; // Рейтинг

  @Column('simple-array')
  tags: string[]; // Жанры (хранятся как массив строк)

  @Column('text')
  about: string; // Краткое описание

  @Column('text')
  description: string; // Полное описание

  @Column()
  image: string; // URL постера

  @Column()
  cover: string; // URL обложки

  @OneToMany(() => Schedule, schedule => schedule.film, { cascade: true })
  schedules: Schedule[]; // Массив сеансов
}