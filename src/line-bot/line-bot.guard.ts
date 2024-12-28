import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { LineBotService } from './line-bot.service';

@Injectable()
export class LineBotGuard implements CanActivate {
  constructor(private readonly botService: LineBotService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    return new Promise((resolve) => {
      this.botService.getMiddleware()(request, null, () => {
        resolve(true);
      });
    });
  }
}
