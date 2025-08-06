import { Test } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { mockCreateOrderDto, mockOrderResponse } from '../mocks/order.mocks';

describe('OrderController', () => {
  let controller: OrderController;
  let service: jest.Mocked<OrderService>;

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
    };

    const module = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        { provide: OrderService, useValue: mockService },
      ],
    }).compile();

    controller = module.get(OrderController);
    service = module.get(OrderService);
  });

  describe('create', () => {
    it('should create order', async () => {
      service.create.mockResolvedValue(mockOrderResponse);
      const result = await controller.create(mockCreateOrderDto);
      expect(result).toEqual(mockOrderResponse);
    });
  });
});
