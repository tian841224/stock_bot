import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegram } from 'telegraf';

export interface ErrorNotificationData {
  message: string;
  stack?: string;
  context?: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  metadata?: Record<string, any>;
}

@Injectable()
export class ErrorNotificationService {
  private readonly logger = new Logger(ErrorNotificationService.name);
  private readonly telegram: Telegram;
  private readonly adminChatId: string;
  private readonly isEnabled: boolean;

  constructor(private readonly configService: ConfigService) {
    const botToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    this.adminChatId = this.configService.get<string>('TELEGRAM_ADMIN_CHAT_ID');
    this.isEnabled = this.configService.get<boolean>('ERROR_NOTIFICATION_ENABLED', true);
    
    if (botToken && this.isEnabled) {
      this.telegram = new Telegram(botToken);
      this.logger.log('錯誤通知服務已啟用');
    } else {
      this.logger.warn('錯誤通知服務未設定或已停用');
    }
  }

  /**
   * 發送錯誤通知到 Telegram
   */
  async sendErrorNotification(data: ErrorNotificationData): Promise<void> {
    if (!this.isEnabled || !this.telegram || !this.adminChatId) {
      return;
    }

    try {
      const message = this.formatErrorMessage(data);
      
      await this.telegram.sendMessage(
        this.adminChatId,
        message,
        { 
          parse_mode: 'HTML',
          link_preview_options: { is_disabled: true }
        }
      );

      this.logger.log(`錯誤通知已發送: ${data.context || 'Unknown context'}`);
    } catch (error) {
      this.logger.error('發送錯誤通知失敗:', error);
    }
  }

  /**
   * 發送簡單的錯誤訊息
   */
  async sendSimpleError(message: string, context?: string): Promise<void> {
    await this.sendErrorNotification({
      message,
      context,
      timestamp: new Date(),
      severity: 'medium'
    });
  }

  /**
   * 發送重要錯誤通知
   */
  async sendCriticalError(message: string, stack?: string, context?: string, metadata?: Record<string, any>): Promise<void> {
    await this.sendErrorNotification({
      message,
      stack,
      context,
      timestamp: new Date(),
      severity: 'critical',
      metadata
    });
  }

  /**
   * 格式化錯誤訊息
   */
  private formatErrorMessage(data: ErrorNotificationData): string {
    const severityEmojis = {
      low: '🟡',
      medium: '🟠', 
      high: '🔴',
      critical: '🚨'
    };

    const emoji = severityEmojis[data.severity] || '⚠️';
    const isProduction = process.env.NODE_ENV === 'production';
    
    let message = `${emoji} <b>系統錯誤通知</b>\n\n`;
    message += `⏰ <b>時間:</b> ${data.timestamp.toLocaleString('zh-TW')}\n`;
    
    if (data.context) {
      message += `📍 <b>來源:</b> <code>${data.context}</code>\n`;
    }
    
    message += `🔥 <b>嚴重程度:</b> ${data.severity.toUpperCase()}\n`;
    message += `💬 <b>錯誤訊息:</b>\n<code>${this.truncateMessage(data.message, 800)}</code>\n`;

    // 顯示額外的中繼資料
    if (data.metadata && Object.keys(data.metadata).length > 0) {
      message += `\n📊 <b>額外資訊:</b>\n`;
      Object.entries(data.metadata).forEach(([key, value]) => {
        message += `• <b>${key}:</b> <code>${this.truncateMessage(String(value), 100)}</code>\n`;
      });
    }

    // 在非生產環境顯示堆疊追蹤
    if (!isProduction && data.stack) {
      message += `\n📋 <b>堆疊追蹤:</b>\n<code>${this.truncateMessage(data.stack, 1200)}</code>`;
    }

    return message;
  }

  /**
   * 截斷過長的訊息
   */
  private truncateMessage(message: string, maxLength: number): string {
    if (!message) return '';
    if (message.length <= maxLength) {
      return message;
    }
    return message.substring(0, maxLength) + '...';
  }

  /**
   * 檢查服務是否可用
   */
  isAvailable(): boolean {
    return this.isEnabled && !!this.telegram && !!this.adminChatId;
  }
}
