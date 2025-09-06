import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  Injectable,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Telegram } from 'telegraf';

@Injectable()
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);
  private readonly telegram: Telegram;
  private readonly adminChatId: string;

  constructor(private readonly configService: ConfigService) {
    const botToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    this.adminChatId = this.configService.get<string>('TELEGRAM_ADMIN_CHAT_ID');
    
    if (botToken) {
      this.telegram = new Telegram(botToken);
    }
  }

  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : exception;

    // 準備錯誤資訊
    const errorInfo = {
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      status,
      message: typeof message === 'string' ? message : JSON.stringify(message),
      stack: exception instanceof Error ? exception.stack : 'No stack trace available',
      userAgent: request.get('User-Agent'),
      ip: request.ip,
    };

    // 記錄錯誤到控制台
    this.logger.error(
      `${errorInfo.method} ${errorInfo.path} - ${errorInfo.status} - ${errorInfo.message}`,
      exception instanceof Error ? exception.stack : 'No stack trace',
    );

    // 發送錯誤通知到 Telegram
    await this.sendErrorNotification(errorInfo);

    // 回應客戶端
    response.status(status).json({
      statusCode: status,
      timestamp: errorInfo.timestamp,
      path: errorInfo.path,
      message: status === HttpStatus.INTERNAL_SERVER_ERROR 
        ? 'Internal server error' 
        : errorInfo.message,
    });
  }

  private async sendErrorNotification(errorInfo: any) {
    if (!this.telegram || !this.adminChatId) {
      this.logger.warn('Telegram bot token or admin chat ID not configured');
      return;
    }

    try {
      const errorMessage = this.formatErrorMessage(errorInfo);
      
      await this.telegram.sendMessage(
        this.adminChatId,
        errorMessage,
        { 
          parse_mode: 'HTML',
          link_preview_options: { is_disabled: true }
        }
      );
    } catch (telegramError) {
      this.logger.error('Failed to send error notification to Telegram:', telegramError);
    }
  }

  private formatErrorMessage(errorInfo: any): string {
    const isProduction = process.env.NODE_ENV === 'production';
    
    let message = `🚨 <b>系統錯誤警報</b>\n\n`;
    message += `⏰ <b>時間:</b> ${new Date(errorInfo.timestamp).toLocaleString('zh-TW')}\n`;
    message += `🔗 <b>路徑:</b> <code>${errorInfo.method} ${errorInfo.path}</code>\n`;
    message += `📊 <b>狀態碼:</b> <code>${errorInfo.status}</code>\n`;
    message += `💬 <b>錯誤訊息:</b>\n<code>${this.truncateMessage(errorInfo.message, 500)}</code>\n`;
    
    if (errorInfo.userAgent) {
      message += `🌐 <b>User Agent:</b> <code>${this.truncateMessage(errorInfo.userAgent, 100)}</code>\n`;
    }
    
    if (errorInfo.ip) {
      message += `🌍 <b>IP:</b> <code>${errorInfo.ip}</code>\n`;
    }

    // 在非生產環境顯示詳細的堆疊追蹤
    if (!isProduction && errorInfo.stack) {
      message += `\n📋 <b>堆疊追蹤:</b>\n<code>${this.truncateMessage(errorInfo.stack, 1000)}</code>`;
    }

    return message;
  }

  private truncateMessage(message: string, maxLength: number): string {
    if (message.length <= maxLength) {
      return message;
    }
    return message.substring(0, maxLength) + '...';
  }
}
