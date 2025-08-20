import { Test } from '@nestjs/testing';
import { BadRequestException, Logger } from '@nestjs/common';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { 
  mockFilmResponseDto,
  mockScheduleResponseDto
} from '../mocks/films.mocks';

describe('FilmsController', () => {
  let controller: FilmsController;
  let service: jest.Mocked<FilmsService>;
  let loggerSpy: jest.SpyInstance;

  beforeEach(async () => {
    loggerSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => {});

    const mockService = {
      findAll: jest.fn(),
      findById: jest.fn(),
    };

    const module = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        { provide: FilmsService, useValue: mockService },
      ],
    }).compile();

    controller = module.get(FilmsController);
    service = module.get(FilmsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllFilms', () => {
    it('should return films data', async () => {
      service.findAll.mockResolvedValue(mockFilmResponseDto);
      const result = await controller.getAllFilms();
      
      expect(result).toEqual(mockFilmResponseDto);
      expect(service.findAll).toHaveBeenCalled();
      expect(loggerSpy).toHaveBeenCalledWith('Handling GET /films request');
    });

    it('should log error when service fails', async () => {
      const error = new Error('Service error');
      service.findAll.mockRejectedValue(error);
      
      await expect(controller.getAllFilms()).rejects.toThrow(error);
      expect(Logger.prototype.error).toHaveBeenCalledWith(
        'GET /films failed: Service error'
      );
    });
  });

  describe('getFilmSchedule', () => {
    it('should return film schedule', async () => {
      service.findById.mockResolvedValue(mockScheduleResponseDto);
      const result = await controller.getFilmSchedule('1');
      
      expect(result).toEqual(mockScheduleResponseDto);
      expect(service.findById).toHaveBeenCalledWith('1');
      expect(loggerSpy).toHaveBeenCalledWith('Handling GET /films/1/schedule request');
    });

    it('should throw BadRequestException when id is empty', async () => {
      await expect(controller.getFilmSchedule('')).rejects.toThrow(BadRequestException);
      expect(Logger.prototype.warn).toHaveBeenCalledWith('Film ID is required');
    });

    it('should log error when service fails', async () => {
      const error = new Error('Service error');
      service.findById.mockRejectedValue(error);
      
      await expect(controller.getFilmSchedule('1')).rejects.toThrow(error);
      expect(Logger.prototype.error).toHaveBeenCalledWith(
        'GET /films/1/schedule failed: Service error'
      );
    });
  });
});
