import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Film } from './film.entity';
import { IsString } from 'class-validator';

@Entity()
export class Schedule {
  //   @Column({ primary: true })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  daytime: string; // Время сеанса (например, "14:00")

  @Column('int')
  hall: number; // Номер зала

  @Column('int')
  rows: number; // Количество рядов в зале

  @Column('int')
  seats: number; // Количество мест в ряду

  @Column('int')
  price: number; // Цена билета

  @Column({ type: 'text' })
  @IsString()
  taken: string;

  @ManyToOne(() => Film, (film) => film.schedules, { onDelete: 'CASCADE' })
  film: Film;
}
