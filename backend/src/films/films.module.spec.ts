import { Test } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { FilmsModule } from './films.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Film } from '../entity/film.entity';
import { Schedule } from '../entity/schedule.entity';
import { mockRepository } from '../__tests__/test-utils';

describe('FilmsModule', () => {
  let moduleRef;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [FilmsModule],
    })
    .overrideProvider(getRepositoryToken(Film))
    .useValue(mockRepository())
    .overrideProvider(getRepositoryToken(Schedule))
    .useValue(mockRepository())
    .overrideProvider('IFilmsRepository')
    .useValue({
      findAll: jest.fn(),
      findById: jest.fn(),
    })
    .compile();
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it('should be defined', () => {
    expect(moduleRef).toBeDefined();
  });
});
