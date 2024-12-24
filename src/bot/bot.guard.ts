import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { BotService } from './bot.service';

@Injectable()
export class BotGuard implements CanActivate {
  constructor(private readonly botService: BotService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    return new Promise((resolve) => {
      this.botService.getMiddleware()(request, null, () => {
        resolve(true);
      });
    });
  }
}
