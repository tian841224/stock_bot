import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { getMiddleware } from './line-middleware';


@Injectable()
export class LineBotGuard implements CanActivate {

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    return new Promise((resolve) => {
      getMiddleware()(request, null, () => {
        resolve(true);
      });
    });
  }
}
