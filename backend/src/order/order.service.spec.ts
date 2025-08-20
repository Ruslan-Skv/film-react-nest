import { Test } from '@nestjs/testing';
import { ConflictException, NotFoundException, Logger } from '@nestjs/common';
import { OrderService } from './order.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Schedule } from '../entity/schedule.entity';
import { mockRepository } from '../__tests__/test-utils';
import { mockFilm, mockSchedule, mockTicket } from '../mocks/order.mocks';

describe('OrderService', () => {
  let service: OrderService;
  let scheduleRepository: any;
  let filmsRepository: any;
  let mockConsole: {
    log: jest.Mock;
    error: jest.Mock;
    warn: jest.Mock;
    debug: jest.Mock;
  };

  beforeEach(async () => {
    // Мокируем console
    mockConsole = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    };
    jest.spyOn(console, 'log').mockImplementation(mockConsole.log);
    jest.spyOn(console, 'error').mockImplementation(mockConsole.error);
    jest.spyOn(console, 'warn').mockImplementation(mockConsole.warn);
    jest.spyOn(console, 'debug').mockImplementation(mockConsole.debug);

    // Мокируем Logger
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});

    const mockFilmsRepository = {
      findById: jest.fn().mockResolvedValue({
        ...mockFilm,
        schedules: [mockSchedule]
      }),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: 'IFilmsRepository', useValue: mockFilmsRepository },
        { 
          provide: getRepositoryToken(Schedule),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    service = moduleRef.get(OrderService);
    filmsRepository = moduleRef.get('IFilmsRepository');
    scheduleRepository = moduleRef.get(getRepositoryToken(Schedule));
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('create', () => {
    it('should create order successfully', async () => {
      const result = await service.create([mockTicket]);
      
      expect(result.items).toHaveLength(1);
      expect(mockConsole.log).toHaveBeenCalled();
    });

    it('should throw NotFoundException if film not found', async () => {
      filmsRepository.findById.mockResolvedValue(null);
      
      await expect(service.create([mockTicket]))
        .rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if session not found', async () => {
      filmsRepository.findById.mockResolvedValue({
        ...mockFilm,
        schedules: []
      });
      
      await expect(service.create([mockTicket]))
        .rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if seat already taken', async () => {
      filmsRepository.findById.mockResolvedValue({
        ...mockFilm,
        schedules: [{
          ...mockSchedule,
          taken: [`${mockTicket.row}:${mockTicket.seat}`]
        }]
      });
      
      await expect(service.create([mockTicket]))
        .rejects.toThrow(ConflictException);
    });
  });
});
