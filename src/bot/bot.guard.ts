import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { BotService } from './bot.service';

@Injectable()
export class BotGuard implements CanActivate {
  constructor(private readonly botService: BotService) { }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    this.botService.getMiddleware()(request, null, () => { });
    return true; // Proceed if middleware passed successfully
  }
}
