import { Injectable } from '@nestjs/common';
import puppeteer, { Browser, Page } from 'puppeteer';

@Injectable()
export class BrowserService {
  constructor() { 
    // this.createBrowser();
    this.createPage();
  }

  browser: Browser;
  page: Page;

  // async initBrowser() {
  //   this.createBrowser();
  //   this.createPage();
  // }

  async disposeBrowser() {
    await this.page?.close();
    await this.browser?.close();
  }

  private async createBrowser() {
    try {
      if (this.browser == null) {
        this.browser = await puppeteer.launch({
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        if (this.browser == null) throw new Error('Browser建立失敗');
        console.log('Browser建立成功');
      }

    } catch (error: any) {
      await this.browser?.close();
      throw new Error(`[createBrowser] : ${error.message}`);
    }
  }

  private async createPage() {
    try {
      if (this.browser == null) await this.createBrowser();
      if (this.page == null) {
        this.page = await this.browser.newPage();
        await this.page.setViewport({ width: 1920, height: 1080 });

        if (this.page == null) throw new Error('Page建立失敗');
        console.log('Page建立成功');
      }

    } catch (error: any) {
      throw new Error(`[createPage] : ${error.message}`);
    }
  }
}
