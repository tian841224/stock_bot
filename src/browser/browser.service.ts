import { Injectable, Logger } from '@nestjs/common';
import puppeteer, { Browser, LaunchOptions, Page } from 'puppeteer';

@Injectable()
export class BrowserService {
  private readonly logger = new Logger(BrowserService.name);

  private browser: Browser;
  private page: Page;

  // constructor() { 
  //   this.createBrowser();
  //   this.createPage();
  // }

  async GetPage(): Promise<Page> {
    if (this.browser == null || this.page == null) {
      await this.createPage();
    }

    return this.page;
  }

  async disposeBrowser() {
    await this.page?.close();
    this.logger.log('釋放Page');
    await this.browser?.close();
    this.logger.log('釋放Browser');
  }

  private async createBrowser() {
    try {
      if (this.browser == null) {
        const options: LaunchOptions = {
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        };

        // 只在 Docker 環境中設定 executablePath
        this.logger.log(`DOCKER_ENV:${process.env.DOCKER_ENV}`);
        if (process.env.DOCKER_ENV === 'true') {
          options.executablePath = '/usr/bin/chromium-browser';
        }

        this.browser = await puppeteer.launch(options);

        if (this.browser == null) throw new Error('Browser建立失敗');
        this.logger.log('Browser建立成功');
      }

    } catch (error) {
      await this.browser?.close();
      throw error;
    }
  }

  private async createPage() {
    try {
      if (this.browser == null) await this.createBrowser();
      if (this.page == null) {
        this.page = await this.browser.newPage();
        await this.page.setViewport({ width: 1920, height: 1080 });

        if (this.page == null) throw new Error('Page建立失敗');
        this.logger.log('Page建立成功');
      }

    } catch (error: any) {
      await this.page?.close();
      throw error;
    }
  }
}
