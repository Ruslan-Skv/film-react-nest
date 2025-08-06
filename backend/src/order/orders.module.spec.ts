import { Test } from '@nestjs/testing';
import { OrdersModule } from './orders.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Schedule } from '../entity/schedule.entity';
import { Film } from '../entity/film.entity';
import { mockRepository } from '../__tests__/test-utils';

describe('OrdersModule', () => {
  let moduleRef;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [OrdersModule],
    })
    .overrideProvider(getRepositoryToken(Schedule))
    .useValue(mockRepository())
    .overrideProvider(getRepositoryToken(Film))
    .useValue(mockRepository())
    .compile();
  });

  it('should compile the module', () => {
    expect(moduleRef).toBeDefined();
  });
});
