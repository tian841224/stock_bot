export interface TopVolumeItemsResponseDto {
    rank: string;           // 排名
    stockId: string;        // 證券代號
    stockName: string;      // 證券名稱
    volume: string;         // 成交股數
    transaction: string;    // 成交筆數
    openPrice: number;      // 開盤價
    highPrice: number;      // 最高價
    lowPrice: number;       // 最低價
    closePrice: number;     // 收盤價
    upDownSign: string;     // 漲跌(+/-)
    changeAmount: number;   // 漲跌價差
    percentageChange: string;   // 漲跌幅(%)
    buyPrice: number;       // 最後揭示買價
    sellPrice: number;      // 最後揭示賣價
}