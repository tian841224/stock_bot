import { Injectable, Logger } from '@nestjs/common';
import puppeteer, { Browser, Page, LaunchOptions } from 'puppeteer';

@Injectable()
export class BrowserService {
  private readonly logger = new Logger(BrowserService.name);
  private browser: Browser | null = null;
  private page: Page | null = null;
  private initializing = false;
  // 定義要排除的請求模式
  readonly ignoredPatterns = [
    'player',
    'advertisement',
    'theme-footer-wrapper'
  ];

  async getPage(): Promise<Page> {
    if (this.initializing) {
      await new Promise(resolve => setTimeout(resolve, 100));
      return this.getPage();
    }

    if (!this.browser?.connected || !this.page || this.page.isClosed()) {
      await this.initialize();
    }

    return this.page!;
  }

  async closePage() {
    if (this.page || !this.page.isClosed()) {
      await this.page.close();
      if (this.page && !this.page.isClosed()) {
        await this.page.close();
        this.logger.log('Page已關閉');
      }
    }
  }

  async dispose(): Promise<void> {
    try {
      if (this.page && !this.page.isClosed()) {
        await this.page.close();
        this.logger.log('Page已關閉');
      }
      if (this.browser?.connected) {
        await this.browser.close();
        this.logger.log('Browser已關閉');
      }
    } catch (error) {
      this.logger.error('釋放資源時發生錯誤', error);
    }
  }

  private async initialize(): Promise<void> {
    this.initializing = true;
    try {
      await this.ensureBrowser();
      await this.ensurePage();
    } catch (error) {
      await this.dispose();
      throw new Error(`初始化失敗: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      this.initializing = false;
    }
  }

  private async ensureBrowser(): Promise<void> {
    if (this.browser?.connected) return;

    const options: LaunchOptions = {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      ...(process.env.DOCKER_ENV === 'true' && {
        executablePath: '/usr/bin/chromium-browser',
      }),
    };

    this.browser = await puppeteer.launch(options);
    this.setupBrowserEventListeners(); // 添加事件監聽
    this.logger.log('Browser初始化成功');
  }

  private async ensurePage(): Promise<void> {
    if (this.page && !this.page.isClosed()) return;

    if (!this.browser?.connected) {
      throw new Error('Browser未連接');
    }

    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1920, height: 1080 });
    
     // 設定請求攔截
     this.logger.log('設定請求攔截');
     await this.page.setRequestInterception(true);
     this.page.on('request', request => {
       // 檢查是否包含任何要排除的模式
       const shouldBlock = this.ignoredPatterns.some(pattern =>
         request.url().includes(pattern)
       );
 
       if (shouldBlock) {
         request.abort();
       } else {
         request.continue();
       }
     });

    // this.setupPageEventListeners(); // 添加頁面事件監聽
    this.logger.log('Page初始化成功');
  }

  private setupBrowserEventListeners(): void {
    if (!this.browser) return;

    // 當瀏覽器斷開連接時
    this.browser.on('disconnected', async () => {
      this.logger.warn('Browser已斷開連接');
      await this.dispose();
      // await this.initialize();
    });

    // // 當有新的目標（tab/page）創建時
    // this.browser.on('targetcreated', (target) => {
    //   this.logger.debug(`新目標創建: ${target.url()}`);
    // });

    // // 當目標被銷毀時
    // this.browser.on('targetdestroyed', (target) => {
    //   this.logger.debug(`目標被銷毀: ${target.url()}`);
    // });
  }

  // private setupPageEventListeners(): void {
  //   if (!this.page) return;

  //   // 頁面錯誤
  //   this.page.on('error', (error) => {
  //     this.logger.error('頁面崩潰', error);
  //   });

  //   // 控制台訊息
  //   this.page.on('console', (msg) => {
  //     const type = msg.type();
  //     const text = msg.text();
  //     if (type === 'error') {
  //       this.logger.error(`頁面控制台錯誤: ${text}`);
  //     } else if (type === 'warn') {
  //       this.logger.warn(`頁面控制台警告: ${text}`);
  //     } else {
  //       this.logger.debug(`頁面控制台訊息[${type}]: ${text}`);
  //     }
  //   });

  //   // 請求失敗
  //   this.page.on('requestfailed', (request) => {
  //     this.logger.warn(`請求失敗: ${request.url()} - ${request.failure()?.errorText}`);
  //   });

  //   // 頁面關閉時
  //   this.page.on('close', () => {
  //     this.logger.log('頁面已關閉');
  //     this.page = null;
  //   });
  // }
}