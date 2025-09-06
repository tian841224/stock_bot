import { Module, Global } from '@nestjs/common';
import { ErrorNotificationService } from './services/error-notification.service';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { TestErrorController } from './controllers/test-error.controller';

@Global()
@Module({
  controllers: [TestErrorController],
  providers: [
    ErrorNotificationService,
    GlobalExceptionFilter,
  ],
  exports: [
    ErrorNotificationService,
    GlobalExceptionFilter,
  ],
})
export class CommonModule {}
