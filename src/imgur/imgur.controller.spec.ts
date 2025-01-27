import { Test, TestingModule } from '@nestjs/testing';
import { ImgurController } from './imgur.controller';

describe('ImgurController', () => {
  let controller: ImgurController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImgurController],
    }).compile();

    controller = module.get<ImgurController>(ImgurController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
