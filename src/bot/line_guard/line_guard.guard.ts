import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import  * as line  from '@line/bot-sdk';

@Injectable()
export class LineGuardGuard implements CanActivate {

  private lineMiddleware;

  constructor() {
    this.lineMiddleware = line.middleware({
      channelSecret: process.env.CHANNEL_SECRET
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    return new Promise((resolve, reject) => {
      this.lineMiddleware(request, request.res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });
  }
}
