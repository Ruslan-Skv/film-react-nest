import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';
import { FilmsRepository } from './films.repository';
import { Film } from '../entity/film.entity';
import { mockFilmWithSchedules } from '../mocks/films.mocks';

describe('FilmsRepository', () => {
  let filmsRepository: FilmsRepository;
  let mockFilmRepository: Repository<Film>;
  let mockLogger: {
    log: jest.Mock;
    error: jest.Mock;
    warn: jest.Mock;
    debug: jest.Mock;
  };

  beforeEach(async () => {
    // Создаем мок логгера
    mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    };

    // Мокаем статический Logger из @nestjs/common
    jest.spyOn(Logger.prototype, 'log').mockImplementation(mockLogger.log);
    jest.spyOn(Logger.prototype, 'error').mockImplementation(mockLogger.error);
    jest.spyOn(Logger.prototype, 'warn').mockImplementation(mockLogger.warn);
    jest.spyOn(Logger.prototype, 'debug').mockImplementation(mockLogger.debug);

    const moduleRef = await Test.createTestingModule({
      providers: [
        FilmsRepository,
        {
          provide: getRepositoryToken(Film),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    filmsRepository = moduleRef.get<FilmsRepository>(FilmsRepository);
    mockFilmRepository = moduleRef.get<Repository<Film>>(getRepositoryToken(Film));
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('findAll', () => {
    it('should return all films with schedules', async () => {
      jest.spyOn(mockFilmRepository, 'find').mockResolvedValue([mockFilmWithSchedules]);

      const result = await filmsRepository.findAll();
      
      expect(result).toEqual([mockFilmWithSchedules]);
      expect(mockLogger.log).toHaveBeenCalledWith('Fetching all films with schedules');
      expect(mockFilmRepository.find).toHaveBeenCalledWith({
        relations: ['schedules'],
        order: { title: 'ASC' },
      });
    });

    it('should log error when repository fails', async () => {
      const error = new Error('Database error');
      jest.spyOn(mockFilmRepository, 'find').mockRejectedValue(error);

      await expect(filmsRepository.findAll()).rejects.toThrow(error);
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Failed to fetch films',
        expect.stringContaining('Database error')
      );
    });
  });

  describe('findById', () => {
    it('should return film by id with schedules', async () => {
      jest.spyOn(mockFilmRepository, 'findOne').mockResolvedValue(mockFilmWithSchedules);

      const result = await filmsRepository.findById('1');
      
      expect(result).toEqual(mockFilmWithSchedules);
      expect(mockLogger.log).toHaveBeenCalledWith('Fetching film by ID: 1');
      expect(mockFilmRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['schedules'],
      });
    });

    it('should return null when film not found', async () => {
      jest.spyOn(mockFilmRepository, 'findOne').mockResolvedValue(null);

      const result = await filmsRepository.findById('1');
      
      expect(result).toBeNull();
      expect(mockLogger.warn).toHaveBeenCalledWith('Film with ID 1 not found');
    });

    it('should log error when repository fails', async () => {
      const error = new Error('Database error');
      jest.spyOn(mockFilmRepository, 'findOne').mockRejectedValue(error);

      await expect(filmsRepository.findById('1')).rejects.toThrow(error);
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Failed to fetch film by ID: 1',
        expect.stringContaining('Database error')
      );
    });
  });
});
