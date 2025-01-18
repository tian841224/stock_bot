import { Inject, Injectable } from '@nestjs/common';
import * as line from '@line/bot-sdk';
import { FlexBubble, FlexMessage, Message, PushMessageRequest, ReplyMessageRequest } from '@line/bot-sdk/dist/messaging-api/api';
import { WebhookEvent } from '@line/bot-sdk';
import { TwStockInfoService } from 'src/tw-stock-info/tw-stock-info.service';
import { TopVolumeItemsResponseDto } from 'src/tw-stock-info/interface/top-volume-item-response-dto';
import { AfterTradingVolumeResponseDto } from 'src/tw-stock-info/interface/after-trading-volume-response-dto';
import { DailyMarketInfoResponseDto } from 'src/tw-stock-info/interface/daily-market-Info-response-dto';

@Injectable()
export class LineBotService {

  constructor(
    @Inject('LINE_CLIENT')
    private readonly lineClient: line.messagingApi.MessagingApiClient,
    private readonly twStockInfoService: TwStockInfoService
  ) { }

  async handleEvent(event: WebhookEvent): Promise<any> {
    if (event.type !== 'message' || event.message.type !== 'text') {
      return null;
    }
    /* 
    * TODO: 
    * 1. 回傳訊息排版
    * 2. 傳送圖片相關功能尚未完成
    */

    // 解析使用者傳入的股票代號
    const [command, number] = event.message.text.split(" ");

    switch (command) {
      case 'bye':
        return this.replyText(event.replyToken, {
          text: 'Goodbye!',
          type: 'text'
        });
      case 'd':
        if (!number) return;
        return this.getDailyMarketInfoAsync(event.replyToken, Number(number));
      case 'a':
        if (!number) return;
        return this.getAfterTradingVolumeAsync(event.replyToken, number);
      case 't':
        return this.getTopVolumeItemsAsync(event.replyToken);
      case 'n':
        if (!number) return;
        return this.getStockNewsAsync(event.replyToken, number);
      case 'k':
        if (!number) return;
        return this.getKlineAsync(event.replyToken, number);
      default:
        return this.replyText(event.replyToken, {
          text: 'Sorry, I did not understand that.',
          type: 'text'
        });
    }
  }

  // 傳送當月市場成交資訊
  private async getDailyMarketInfoAsync(userId: string, count?: number) {
    var info = await this.twStockInfoService.getDailyMarketInfoAsync(count);
    var result = await this.formatDailyMarketInfoToFlexMessage(info);
    this.replyText(userId, result);
  }

  // 傳送個股當日成交資訊
  private async getAfterTradingVolumeAsync(userId: string, symbol: string) {
    var info = await this.twStockInfoService.getAfterTradingVolumeAsync(symbol);
    var result = await this.formatStockInfoToFlexMessage(info);
    this.replyText(userId, result);
  }

  // 傳送成交量前20股票
  private async getTopVolumeItemsAsync(userId: string) {
    var info = await this.twStockInfoService.getTopVolumeItemsAsync();
    var result = await this.formatTopTenToFlexMessage(info);
    await this.replyText(userId, result);
  }

  // 傳送股票新聞
  private async getStockNewsAsync(userId: string, symbol: string) {
    var info = await this.twStockInfoService.getStockNewsAsync(symbol);
    var result = await this.formatNewsToFlexMessage(info);
    await this.replyText(userId, result);
  }

  // 傳送K線圖
  async getKlineAsync(userId: string, symbol: string) {
    var info = await this.twStockInfoService.getKlineAsync(symbol);

    // 將 base64 轉換為 data URL
    const imageUrl = `data:image/png;base64,${info}`;

    const message: ReplyMessageRequest = {
      replyToken: userId,
      messages: [{
        type: 'image',
        originalContentUrl: imageUrl,
        previewImageUrl: imageUrl
      }]
    };
    await this.lineClient.replyMessage(message);
  }

  // 推送訊息
  private pushMessage(userId: string, text: Message): Promise<any> {
    const message: PushMessageRequest = {
      to: userId,
      messages: [text]
    };

    return this.lineClient.pushMessage(message);
  }

  // 回覆訊息
  private replyText(replyToken: string, text: Message): Promise<any> {
    const message: ReplyMessageRequest = {
      replyToken,
      messages: [text]
    };

    return this.lineClient.replyMessage(message);
  }

  private formatDailyMarketInfoToFlexMessage(data: DailyMarketInfoResponseDto[]): FlexMessage {
    const bubbles: FlexBubble[] = data.map(item => {
      const changeValue = parseFloat(item.change);
      const changeColor = changeValue >= 0 ? '#E63946' : '#2A9D8F'; // 漲用紅色，跌用綠色

      return {
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: '當日交易資訊',
              weight: 'bold',
              size: 'xl',
              color: '#333333',
              margin: 'md'
            },
            {
              type: 'text',
              text: item.date,
              size: 'sm',
              color: '#666666',
              margin: 'sm'
            },
            {
              type: 'separator',
              margin: 'lg'
            },
            {
              type: 'box',
              layout: 'vertical',
              margin: 'lg',
              spacing: 'sm',
              contents: [
                {
                  type: 'box',
                  layout: 'horizontal',
                  contents: [
                    {
                      type: 'text',
                      text: '發行量加權指數',
                      size: 'md',
                      color: '#333333',
                      flex: 6
                    },
                    {
                      type: 'text',
                      text: item.index,
                      size: 'md',
                      color: '#000000',
                      align: 'end',
                      flex: 4
                    }
                  ]
                },
                {
                  type: 'box',
                  layout: 'horizontal',
                  contents: [
                    {
                      type: 'text',
                      text: '漲跌點數',
                      size: 'md',
                      color: changeColor,
                      flex: 6
                    },
                    {
                      type: 'text',
                      text: item.change,
                      size: 'md',
                      color: changeColor,
                      align: 'end',
                      flex: 4,
                      weight: 'bold'
                    }
                  ]
                },
                {
                  type: 'separator',
                  margin: 'lg'
                },
                {
                  type: 'box',
                  layout: 'vertical',
                  margin: 'lg',
                  contents: [
                    {
                      type: 'box',
                      layout: 'horizontal',
                      contents: [
                        {
                          type: 'text',
                          text: '成交股數',
                          size: 'sm',
                          color: '#666666',
                          flex: 6
                        },
                        {
                          type: 'text',
                          text: item.volume,
                          size: 'sm',
                          color: '#333333',
                          align: 'end',
                          flex: 4
                        }
                      ],
                      margin: 'sm'
                    },
                    {
                      type: 'box',
                      layout: 'horizontal',
                      contents: [
                        {
                          type: 'text',
                          text: '成交金額',
                          size: 'sm',
                          color: '#666666',
                          flex: 6
                        },
                        {
                          type: 'text',
                          text: item.amount,
                          size: 'sm',
                          color: '#333333',
                          align: 'end',
                          flex: 4
                        }
                      ],
                      margin: 'sm'
                    },
                    {
                      type: 'box',
                      layout: 'horizontal',
                      contents: [
                        {
                          type: 'text',
                          text: '成交筆數',
                          size: 'sm',
                          color: '#666666',
                          flex: 6
                        },
                        {
                          type: 'text',
                          text: item.transaction,
                          size: 'sm',
                          color: '#333333',
                          align: 'end',
                          flex: 4
                        }
                      ],
                      margin: 'sm'
                    }
                  ]
                }
              ]
            }
          ],
          backgroundColor: '#F5F5F5'
        }
      };
    });

    return {
      type: 'flex',
      altText: '台股今日大盤交易資訊',
      contents: {
        type: 'carousel',
        contents: bubbles
      }
    };
  }

  private formatStockInfoToFlexMessage(stockInfo: AfterTradingVolumeResponseDto): FlexMessage {
    // 修正漲跌符號處理
    const upDownSign = stockInfo.upDownSign?.trim().replace(/<[^>]*>/g, '') || '';
    const getUpDownSign = (sign: string) => {
      if (sign.includes('+')) return '+';
      if (sign.includes('-')) return '-';
      return '';
    };
    const actualUpDownSign = getUpDownSign(upDownSign);
    const changeColor = upDownSign === "+" ? "#E63946" : upDownSign === "-" ? "#2A9D8F" : "#333333";
    const percentageChange = stockInfo.openPrice !== 0 ? `${(stockInfo.changeAmount / stockInfo.openPrice * 100).toFixed(2)}%` : "0.00%";

    return {
      type: "flex",
      altText: `${stockInfo.stockName} (${stockInfo.stockId}) 股票資訊`,
      contents: {
        type: "bubble",
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "box",
              layout: "horizontal",
              contents: [
                {
                  type: "text",
                  text: `${stockInfo.stockName} (${stockInfo.stockId})`,
                  weight: "bold",
                  size: "xl",
                  color: "#333333",
                  flex: 5
                },
                {
                  type: "text",
                  text: upDownSign === "+" ? "📈" : upDownSign === "-" ? "📉" : "➖",
                  size: "xl",
                  flex: 1,
                  align: "end"
                }
              ]
            },
            {
              type: "separator",
              margin: "lg"
            },
            {
              type: "box",
              layout: "vertical",
              spacing: "sm",
              margin: "lg",
              contents: [
                {
                  type: "box",
                  layout: "horizontal",
                  contents: [
                    {
                      type: "text",
                      text: "收盤價",
                      size: "md",
                      color: "#666666",
                      flex: 3
                    },
                    {
                      type: "text",
                      text: stockInfo.highPrice?.toString() || "",
                      size: "xl",
                      color: changeColor,
                      align: "end",
                      weight: "bold",
                      flex: 4
                    }
                  ]
                },
                {
                  type: "box",
                  layout: "horizontal",
                  contents: [
                    {
                      type: "text",
                      text: "漲跌",
                      size: "sm",
                      color: "#666666",
                      flex: 3
                    },
                    {
                      type: "text",
                      text: `${actualUpDownSign}${stockInfo.changeAmount} (${percentageChange})`,
                      size: "sm",
                      color: changeColor,
                      align: "end",
                      flex: 4
                    }
                  ]
                }
              ]
            },
            {
              type: "box",
              layout: "vertical",
              margin: "lg",
              contents: [
                ["成交股數", stockInfo.volume],
                ["成交金額", stockInfo.amount],
                ["成交筆數", stockInfo.transaction],
                ["開盤價", stockInfo.openPrice.toString()],
                ["最高價", stockInfo.highPrice.toString()],
                ["最低價", stockInfo.lowPrice.toString()],
              ].map(([label, value]) => ({
                type: "box",
                layout: "horizontal",
                margin: "sm",
                contents: [
                  {
                    type: "text",
                    text: label,
                    size: "sm",
                    color: "#666666",
                    flex: 3
                  },
                  {
                    type: "text",
                    text: value?.toString() || "",
                    size: "sm",
                    color: "#333333",
                    align: "end",
                    flex: 4
                  }
                ]
              }))
            }
          ]
        }
      }
    };
  }

  private formatTopTenToFlexMessage(stockData: TopVolumeItemsResponseDto[]): FlexMessage {
    const topTen = stockData.slice(0, 10);

    return {
      type: 'flex',
      altText: '今日交易量前十名',
      contents: {
        type: 'bubble',
        size: 'giga',
        header: {
          type: 'box',
          layout: 'vertical',
          contents: [{
            type: 'text',
            text: '今日交易量排行',
            weight: 'bold',
            size: 'xl',
            align: 'center'
          }],
          backgroundColor: '#F5F5F5'
        },
        body: {
          type: 'box',
          layout: 'vertical',
          spacing: 'md',
          contents: topTen.map((item, index) => {
            const upDownSign = item.upDownSign?.toString()?.trim().replace(/<[^>]*>/g, '') || '';
            const changeColor = upDownSign.includes('+') ? '#E63946' :
              upDownSign.includes('-') ? '#2A9D8F' : '#333333';
            const percentageChange = item.openPrice !== 0 ?
              `${(item.changeAmount / item.openPrice * 100).toFixed(2)}%` : "0.00%";

            return {
              type: 'box',
              layout: 'vertical',
              backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F8F8F8',
              paddingAll: '10px',
              contents: [
                // 標題列
                {
                  type: 'box',
                  layout: 'horizontal',
                  contents: [
                    {
                      type: 'text',
                      text: `${index + 1}. ${item.stockName.replace(/\s+/g, '')}(${item.stockId.replace(/\s+/g, '')}) ${upDownSign.includes('+') ? "📈" : upDownSign.includes('-') ? "📉" : "➖"}`, // 組合文字，移除空格
                      size: 'sm',
                      color: changeColor,
                      weight: 'bold',
                      flex: 9, // 分配大部分寬度給文字
                      margin: 'none'
                    }
                  ],
                  spacing: 'none', // 移除內部的間距
                  paddingAll: '5px', // 減少整體內邊距
                },
                // 交易資訊
                {
                  type: 'box',
                  layout: 'vertical',
                  margin: 'sm',
                  contents: [
                    {
                      type: 'box',
                      layout: 'horizontal',
                      contents: [
                        { type: 'text', text: '成交股數', size: 'xs', color: '#666666', flex: 3 },
                        { type: 'text', text: item.volume?.toString() || '0', size: 'xs', color: '#333333', align: 'end', flex: 7 }
                      ]
                    },
                    {
                      type: 'box',
                      layout: 'horizontal',
                      contents: [
                        { type: 'text', text: '成交筆數', size: 'xs', color: '#666666', flex: 3 },
                        { type: 'text', text: item.transaction?.toString() || '0', size: 'xs', color: '#333333', align: 'end', flex: 7 }
                      ]
                    },
                    {
                      type: 'box',
                      layout: 'horizontal',
                      contents: [
                        { type: 'text', text: '開盤價', size: 'xs', color: '#666666', flex: 3 },
                        { type: 'text', text: item.openPrice?.toString() || '0', size: 'xs', color: '#333333', align: 'end', flex: 7 }
                      ]
                    },
                    {
                      type: 'box',
                      layout: 'horizontal',
                      contents: [
                        { type: 'text', text: '收盤價', size: 'xs', color: '#666666', flex: 3 },
                        { type: 'text', text: item.closePrice?.toString() || '0', size: 'xs', color: changeColor, align: 'end', flex: 7, weight: 'bold' }
                      ]
                    },
                    {
                      type: 'box',
                      layout: 'horizontal',
                      contents: [
                        { type: 'text', text: '漲跌幅', size: 'xs', color: '#666666', flex: 3 },
                        { type: 'text', text: `${upDownSign}${item.changeAmount} (${percentageChange})`, size: 'xs', color: changeColor, align: 'end', flex: 7 }
                      ]
                    },
                    {
                      type: 'box',
                      layout: 'horizontal',
                      contents: [
                        { type: 'text', text: '最高價', size: 'xs', color: '#666666', flex: 3 },
                        { type: 'text', text: item.highPrice?.toString() || '0', size: 'xs', color: '#333333', align: 'end', flex: 7 }
                      ]
                    },
                    {
                      type: 'box',
                      layout: 'horizontal',
                      contents: [
                        { type: 'text', text: '最低價', size: 'xs', color: '#666666', flex: 3 },
                        { type: 'text', text: item.lowPrice?.toString() || '0', size: 'xs', color: '#333333', align: 'end', flex: 7 }
                      ]
                    }
                  ]
                }
              ]
            };
          })
        }
      }
    };
  }

  private formatNewsToFlexMessage(newsData: YahooNewsRssResponse[]): FlexMessage {
    return {
      type: 'flex',
      altText: '最新股市新聞',
      contents: {
        type: 'bubble',
        size: 'giga',
        header: {
          type: 'box',
          layout: 'vertical',
          contents: [{
            type: 'text',
            text: '最新股市新聞',
            weight: 'bold',
            size: 'xl',
            align: 'center'
          }],
          backgroundColor: '#F5F5F5'
        },
        body: {
          type: 'box',
          layout: 'vertical',
          spacing: 'md',
          contents: newsData.map((item, index) => ({
            type: 'box',
            layout: 'vertical',
            backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F8F8F8',
            paddingAll: '10px',
            contents: [
              {
                type: 'text',
                text: `${item.title}`,
                wrap: true,
                size: 'sm',
                color: '#1a73e8',
                action: {
                  type: 'uri',
                  label: 'View Details',
                  uri: item.link || ''
                }
              }
            ]
          }))
        }
      }
    };
  }
}
