import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class UsStockInfoService {
    private readonly baseUrl = 'https://www.alphavantage.co/query';

    constructor(
        @Inject('ALPHA_VANTAGE_API_KEY')
        private readonly apiKey: string,
    ) { }

    // 盤中資料
    async getTimeSeriesIntraday() {

        axios.interceptors.request.use(request => {
            console.debug('Request URL:', request.url);
            console.log('Full URL:', `${request.url}?${new URLSearchParams(request.params)}`);
            return request;
        });

        const params = {
            function: 'TIME_SERIES_INTRADAY',
            symbol: 'AAPL',
            // interval: '5min',
            // month: '2024-12',
            apikey: this.apiKey
        };

        const response = await axios.get(this.baseUrl, { params });
        return response.data;
    }
}
