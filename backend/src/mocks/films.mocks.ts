import { Film } from '../entity/film.entity';
import { Schedule } from '../entity/schedule.entity';
import { FilmResponseDto, FilmItemDto } from '../films/dto/film.dto';
import { ScheduleResponseDto, SessionDto } from '../films/dto/schedule.dto';

export const mockFilm: Film = {
  id: '1',
  title: 'Inception',
  director: 'Christopher Nolan',
  rating: 8.8,
  tags: ['sci-fi', 'action'],
  about: 'A thief who steals corporate secrets',
  description: 'A thief who steals corporate secrets through the use of dream-sharing technology...',
  image: 'https://example.com/inception.jpg',
  cover: 'https://example.com/inception-cover.jpg',
  schedules: [],
};

export const mockSchedule: Schedule = {
  id: 's1',
  daytime: '14:00',
  hall: 1,
  rows: 10,
  seats: 20,
  price: 500,
  taken: ['A1', 'A2'],
  film: mockFilm,
};

export const mockFilmWithSchedules: Film = {
  ...mockFilm,
  schedules: [mockSchedule],
};

export const mockFilmItemDto: FilmItemDto = {
  id: '1',
  title: 'Inception',
  director: 'Christopher Nolan',
  rating: 8.8,
  tags: ['sci-fi', 'action'],
  about: 'A thief who steals corporate secrets',
  description: 'A thief who steals corporate secrets through the use of dream-sharing technology...',
  image: 'https://example.com/inception.jpg',
  cover: 'https://example.com/inception-cover.jpg',
};

export const mockFilmResponseDto: FilmResponseDto = {
  total: 1,
  items: [mockFilmItemDto],
};

export const mockSessionDto: SessionDto = {
  id: 's1',
  daytime: '14:00',
  hall: 1,
  rows: 10,
  seats: 20,
  price: 500,
  taken: ['A1', 'A2'],
};

export const mockScheduleResponseDto: ScheduleResponseDto = {
  total: 1,
  items: [mockSessionDto],
};