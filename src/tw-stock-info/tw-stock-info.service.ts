import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as Parser from 'rss-parser';  // 正確的方式


@Injectable()
export class TwStockInfoService {
    // 台灣證券交易所網址
    private readonly twseUrl = 'https://www.twse.com.tw/rwd/zh';

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
        return response.data.data;
    }

    // 盤後資訊
    async getAfterTradingVolumeAsync(symbol: string): Promise<any> {

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
        return response.data.data;
    }

    // 股票新聞
    async getStockNewsAsync(symbol?: string): Promise<YahooNewsRssResponse[]> {
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

    // 處理交易日
    getTradeDate() {
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