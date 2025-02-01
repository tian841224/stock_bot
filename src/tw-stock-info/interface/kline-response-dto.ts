interface NewsItem {
    text: string;
    url: string;
}

interface KlineResponseDto {
    stockName : string,
    symbol : string,
    image : Uint8Array
}