import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { log } from 'console';
import * as Parser from 'rss-parser';  // 正確的方式
import { BrowserService } from 'src/browser/browser.service';


@Injectable()
export class TwStockInfoService {
    private readonly twseUrl = 'https://www.twse.com.tw/rwd/zh';
    private readonly yahooUrl = 'https://tw.stock.yahoo.com';
    private readonly cnyesUrl = 'https://www.cnyes.com/twstock/';
    constructor(
        private readonly browserService: BrowserService,
    ) { }
    // 台灣證券交易所網址

    // 當月市場成交資訊
    async getDailyMarketInfoAsync(count: number = 1): Promise<TWSEApiResponse["data"]> {

        const url = this.twseUrl + '/afterTrading/FMTQIK'

        //印出請求網址
        axios.interceptors.request.use(request => {
            console.log('getDailyMarketInfoAsync URL:', `${request.url}`);
            return request;
        });

        const response = await axios.get<TWSEApiResponse>(url);

        if (response.data.data && Array.isArray(response.data.data)) {
            if (count == null) count = 1;
            response.data.data = response.data.data.slice(-count);
        }

        return response.data.data;
    }

    // 盤後資訊
    async getAfterTradingVolumeAsync(symbol: string): Promise<Object[]> {

        // 轉換日期格式
        const date = this.getTradeDate();
        const url = this.twseUrl + `/afterTrading/MI_INDEX?date=${date}&type=ALLBUT0999`

        //印出請求網址
        axios.interceptors.request.use(request => {
            console.log('getAfterTradingVolumeAsync URL:', `${request.url}`);
            return request;
        });

        const response = await axios.get<TWSEApiResponse>(url);

        // 股票清單
        const stockList = response?.data?.tables?.[8];
        if (!stockList?.data) return;

        // 篩選指定股票
        const stockInfo = stockList.data.find(x => x?.[0]?.toString() === symbol);
        if (!stockInfo) {
            return;
        }

        return stockInfo;
    }

    // 成交量前20股票
    async getTopVolumeItemsAsync(): Promise<TWSEApiResponse["data"]> {

        // 轉換日期格式
        const url = this.twseUrl + `/afterTrading/MI_INDEX20`

        //印出請求網址
        axios.interceptors.request.use(request => {
            console.log('getTopVolumeItemsAsync URL:', `${request.url}`);
            return request;
        });

        const response = await axios.get<TWSEApiResponse>(url);

        return response.data.data;
    }

    // 股票新聞
    async getStockNewsAsync(symbol?: string): Promise<YahooNewsRssResponse[]> {

        let url = `https://tw.stock.yahoo.com/rss?category=tw-market`;

        if (symbol != null) url = `https://tw.stock.yahoo.com/rss?s=${symbol}.TW`

        //印出請求網址
        axios.interceptors.request.use(request => {
            console.log('getTopVolumeItemsAsync URL:', `${request.url}`);
            return request;
        });

        const parser = new Parser();
        const response = await parser.parseURL(url);


        // 取前 5 筆資料並轉換格式
        return response.items.slice(0, 5).map<YahooNewsRssResponse>(x => {
            return {
                title: x.title,
                link: x.link,
                //   pubDate: x.pubDate,
                //   description: x.description,
            };
        });
    }

    // 取得K線圖表
    async getKlineAsync(symbol: string, input: string = '日K'): Promise<KlineResponseDto> {
        try {
            this.browserService.initBrowser();
            const page = this.browserService.page;
            // 載入網頁
            await page.goto(this.cnyesUrl + symbol);
            // 等待圖表載入
            await page.waitForSelector('div.simple-chart table');
            // 取得股票名稱
            const element = await page.waitForSelector('div.quote-header h2');
            const textContent = await element.evaluate(el => el.innerText);
            const stockName = textContent.split('\n')[0] || '未知股票';

            // 等待並點擊按鈕
            await page.waitForSelector('div.chart_range_selector button');
            const buttons = await page.$$('div.chart_range_selector button');

            for (const button of buttons) {
                const text = await button.evaluate(el => el.textContent);
                if (text.includes(input)) {
                    await button.click();
                    break;
                }
            }

            // 等待網路請求完成
            await page.waitForNetworkIdle();

            // 等待圖表元素
            const chartElement = await page.waitForSelector('div.tradingview-chart');
            if (!chartElement) {
                throw new Error('找不到圖表元素');
            }

            let result: KlineResponseDto = ({
                stockName: stockName,
                symbol: symbol,
                image: await chartElement.screenshot(),
            });

            return result;
        }
        catch (error) {
            Logger.error(error, 'getKlineAsync');
            return null;
        }
    }

    // 取得詳細圖表
    async getDetailPriceAsync(symbol: string): Promise<DetailPriceResponseDto> {
        try {
            this.browserService.initBrowser();
            const page = this.browserService.page;

            // 載入網頁
            await page.goto(this.cnyesUrl + symbol);

            interface InfoDictionary {
                [key: number]: string;
            }

            // 等待圖表載入
            await page.waitForSelector('div.simple-chart table');

            // 取得股票名稱
            const element = await page.waitForSelector('div.quote-header h2');
            const textContent = await element.evaluate(el => el.innerText);
            const stockName = textContent.split('\n')[0] || '未知股票';

            // 取得詳細報價
            const detailContent = await page.waitForSelector('div.detail-content');
            const stockDetails = await detailContent.evaluate(el => el.innerText);
            const stockDetailsList = stockDetails.split('\n');

            // 取得股價相關資訊
            const priceElement = await page.waitForSelector('div.container .price h3');
            const price = await priceElement.evaluate(el => el.innerText);

            const changePriceElement = await page.waitForSelector('div.first-row span:nth-child(1)');
            const changePrice = await changePriceElement.evaluate(el => el.innerText);

            const amplitudeElement = await page.waitForSelector('div.first-row span:nth-child(2)');
            const amplitude = await amplitudeElement.evaluate(el => el.innerText);

            // stockDetailsList欄位對應中文
            const InfoDic: InfoDictionary = {
                1: "開盤價", 2: "最高價", 3: "成交量",
                4: "昨日收盤價", 5: "最低價", 6: "成交額",
                7: "均價", 8: "本益比", 9: "市值",
                10: "振幅", 11: "迴轉率", 12: "發行股",
                13: "漲停", 14: "52W高", 15: "內盤量",
                16: "跌停", 17: "52W低", 18: "外盤量",
                19: "近四季EPS", 20: "當季EPS", 21: "毛利率",
                22: "每股淨值", 23: "本淨比", 24: "營利率",
                25: "年股利", 26: "殖利率", 27: "淨利率"
            };

            const output = [1, 2, 5]; // 選擇輸出欄位

            let chart: string[] = [];
            chart.push(`<b>-${stockName}-📝</b>`);
            chart.push(`<code>收盤價：${price}</code>`);
            chart.push(`<code>漲跌幅：${changePrice}</code>`);
            chart.push(`<code>漲跌%：${amplitude}</code>`);

            for (const i of output) {
                if (i * 2 - 1 < stockDetailsList.length) {
                    chart.push(`<code>${InfoDic[i]}：${stockDetailsList[i * 2 - 1]}</code>`);
                } else {
                    Logger.warn(`索引 ${i * 2 - 1} 超出 stockDetailsList 範圍。`);
                }
            }

            // 等待圖表載入
            await page.waitForNetworkIdle();
            const chartElement = await page.waitForSelector('div.overview-top');

            const result: DetailPriceResponseDto = {
                stockName: stockName,
                price: price,
                changePrice: changePrice,
                amplitude: amplitude,
                details: chart,
                image: await chartElement.screenshot()
            };

            return result;
        }
        catch (error) {
            Logger.error(error, 'getDetailPriceAsync');
            return null;
        }
    }

    // 取得股票機校
    async getPerformanceAsync(symbol: string): Promise<PerformanceResponseDto> {
        try {
            this.browserService.initBrowser();
            const page = this.browserService.page;

            // 載入網頁
            await page.goto(this.cnyesUrl + symbol);

            // 處理 cookie 提示
            const cookieButton = await page.waitForSelector("#__next > div._1GCLL > div > button._122qv", { timeout: 5000 });
            if (cookieButton) {
                await cookieButton.click();
            }

            // 滾動頁面到底部
            await page.evaluate(() => {
                window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: 'smooth'
                });
            });

            // 等待圖表和數據載入
            await page.waitForSelector('div.overview-top');
            await page.waitForSelector('table.flex');

            // 取得股票名稱
            const element = await page.waitForSelector('div.quote-header h2');
            const textContent = await element.evaluate(el => el.innerText);
            const stockName = textContent.split('\n')[0] || '未知股票';

            // 等待價格元素
            const priceElement = await page.waitForSelector('#tw-stock-tabs div:nth-child(2) section');
            if (!priceElement) {
                throw new Error('找不到價格元素');
            }

            // 等待網路請求完成
            await page.waitForNetworkIdle();

            Logger.log('擷取網站中...');
            const screenshot = await priceElement.screenshot();
            let result: PerformanceResponseDto = ({
                stockName: stockName,
                symbol: symbol,
                image: screenshot,
            });

            return result;
        } catch (error) {
            Logger.error(error, 'getDetailPriceAsync');
            return null;
        }
    }

    async getNewsAsync(symbol: string): Promise<NewsResponseDto> {
        try {
            this.browserService.initBrowser();
            const page = this.browserService.page;

            // 載入網頁
            await page.goto(this.cnyesUrl + symbol);

            // 取得股票名稱
            const element = await page.waitForSelector('div.quote-header h2');
            const textContent = await element.evaluate(el => el.innerText);
            const stockName = textContent.split('\n')[0] || '未知股票';

            // 等待新聞區塊載入
            const newsContainer = await page.waitForSelector('div.news-notice-container-summary');
            if (!newsContainer) {
                throw new Error('找不到新聞區塊');
            }

            // 取得新聞列表
            const newsElements = await page.$$('a.container.shadow');
            const newsList: NewsItem[] = [];

            // 擷取前5則新聞
            for (let i = 0; i < Math.min(5, newsElements.length); i++) {
                const newsElement = newsElements[i];
                const text = await newsElement.evaluate(el => el.textContent);
                const url = await newsElement.evaluate(el => el.href);

                if (text && url) {
                    newsList.push({ text, url });
                }
            }

            return {
                stockName,
                newsList
            };

        } catch (error) {
            Logger.error(error, 'getNewsAsync');
            return null;
        }
    }

    // 處理交易日
    private getTradeDate() {
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 是週日, 6 是週六

        // 如果是週六，往前調一天
        if (dayOfWeek === 6) {
            today.setDate(today.getDate() - 1);
        }
        // 如果是週日，往前調兩天
        else if (dayOfWeek === 0) {
            today.setDate(today.getDate() - 2);
        }

        return today.toISOString().slice(0, 10).replace(/-/g, '');
    }


} 