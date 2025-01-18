export interface AfterTradingVolumeResponseDto {
    stockId: string;        // 股票代號
    stockName: string;      // 股票名稱
    volume: string;         // 成交股數
    transaction: string;    // 成交筆數
    amount: string;         // 成交金額
    openPrice: number;      // 開盤價
    closePrice: number;     // 收盤價
    highPrice: number;      // 最高價
    lowPrice: number;       // 最低價
    upDownSign: string;     // 漲跌符號
    changeAmount: number;   // 漲跌金額
    percentageChange: string;   // 漲跌幅
}