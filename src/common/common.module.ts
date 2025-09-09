import { Module, Global } from '@nestjs/common';
import { ErrorNotificationService } from './services/error-notification.service';
import { GlobalExceptionFilter } from './filters/global-exception.filter';

@Global()
@Module({
  controllers: [],
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
