import { Test } from '@nestjs/testing';
import { Logger, NotFoundException } from '@nestjs/common';
import { FilmsService } from './films.service';
import { IFilmsRepository } from '../repository/films.repository';
import { 
  mockFilm,
  mockFilmWithSchedules,
  mockFilmResponseDto,
  mockScheduleResponseDto
} from '../mocks/films.mocks';

describe('FilmsService', () => {
  let service: FilmsService;
  let repository: jest.Mocked<IFilmsRepository>;
  let loggerSpy: jest.SpyInstance;

  beforeEach(async () => {
    loggerSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => {});

    const mockRepository: jest.Mocked<IFilmsRepository> = {
      findAll: jest.fn(),
      findById: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        FilmsService,
        { provide: 'IFilmsRepository', useValue: mockRepository },
      ],
    }).compile();

    service = module.get(FilmsService);
    repository = module.get('IFilmsRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return formatted films data', async () => {
      repository.findAll.mockResolvedValue([mockFilm]);
      const result = await service.findAll();
      
      expect(result).toEqual(mockFilmResponseDto);
      expect(repository.findAll).toHaveBeenCalled();
      expect(loggerSpy).toHaveBeenCalledWith('Fetching all films');
    });

    it('should log error when repository fails', async () => {
      const error = new Error('Database error');
      repository.findAll.mockRejectedValue(error);
      
      await expect(service.findAll()).rejects.toThrow(error);
      expect(Logger.prototype.error).toHaveBeenCalledWith(
        'Failed to fetch films',
        expect.any(String)
      );
    });
  });

  describe('findById', () => {
    it('should return formatted schedule data', async () => {
      repository.findById.mockResolvedValue(mockFilmWithSchedules);
      const result = await service.findById('1');
      
      expect(result).toEqual(mockScheduleResponseDto);
      expect(repository.findById).toHaveBeenCalledWith('1');
      expect(loggerSpy).toHaveBeenCalledWith('Fetching film schedule for ID: 1');
    });

    it('should throw NotFoundException when film not found', async () => {
      repository.findById.mockResolvedValue(null);
      
      await expect(service.findById('1')).rejects.toThrow(NotFoundException);
      expect(Logger.prototype.warn).toHaveBeenCalledWith(
        'Film not found with ID: 1'
      );
    });

    it('should log error when repository fails', async () => {
      const error = new Error('Database error');
      repository.findById.mockRejectedValue(error);
      
      await expect(service.findById('1')).rejects.toThrow(error);
      expect(Logger.prototype.error).toHaveBeenCalledWith(
        'Failed to fetch film schedule for ID: 1',
        expect.any(String)
      );
    });
  });
});
