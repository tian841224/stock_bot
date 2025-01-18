export interface DailyMarketInfoResponseDto {
    date: string;           // 日期
    volume: string;         // 成交股數
    amount: string;         // 成交金額
    transaction: string;    // 成交筆數
    index: string;         // 發行量加權股價指數
    change: string;        // 漲跌點數
}