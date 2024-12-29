import { Inject, Injectable } from '@nestjs/common';
import * as line from '@line/bot-sdk';
import { FlexBubble, FlexMessage, PushMessageRequest, ReplyMessageRequest } from '@line/bot-sdk/dist/messaging-api/api';
import { WebhookEvent } from '@line/bot-sdk';
import { TwStockInfoService } from 'src/tw-stock-info/tw-stock-info.service';

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
    * 1. 解析使用者傳入股票代號
    * 2. 回傳訊息排版
    */
    switch (event.message.text) {
      case 'bye':
        return this.replyText(event.replyToken, 'Goodbye!');
      case 'user':
        return this.replyText(event.replyToken, event.source.userId);
      case 'd':
        return this.getDailyMarketInfoAsync(event.source.userId, 10);
      case 'a':
        return this.getAfterTradingVolumeAsync(event.source.userId, '6558');
      case 't':
        return this.getTopVolumeItemsAsync(event.source.userId);
      case 'n':
        return this.getStockNewsAsync(event.source.userId,'2330');
      default:
        return this.replyText(event.replyToken, 'Sorry, I did not understand that.');
    }
  }

  // 傳送當月市場成交資訊
  private async getDailyMarketInfoAsync(userId: string, count?: number) {
    var info = await this.twStockInfoService.getDailyMarketInfoAsync(count);
    var result = await this.formatDailyMarketInfoToFlexMessage(info);
    this.pushMessage(userId, result);
  }

  // 傳送個股當日成交資訊
  private async getAfterTradingVolumeAsync(userId: string, symbol: string) {
    var info = await this.twStockInfoService.getAfterTradingVolumeAsync(symbol);
    var result = await this.formatStockInfoToFlexMessage(info);
    this.pushMessage(userId, result);
  }

  // 傳送成交量前20股票
  private async getTopVolumeItemsAsync(userId: string) {
    var info = await this.twStockInfoService.getTopVolumeItemsAsync();
    var result = await this.formatTopTenToFlexMessage(info);
    this.pushMessage(userId, result);
  }

  // 傳送股票新聞
  private async getStockNewsAsync(userId: string, symbol: string) {
    var info = await this.twStockInfoService.getStockNewsAsync(symbol);
    var result = await this.formatNewsToFlexMessage(info);
    this.pushMessage(userId, result);
  }

  // 推送FlexMessage訊息
  private pushMessage(userId: string, flexMessage: FlexMessage): Promise<any> {
    const message: PushMessageRequest = {
      to: userId,
      messages: [flexMessage]
    };

    return this.lineClient.pushMessage(message);
  }

  // 回覆訊息
  private replyText(replyToken: string, text: string): Promise<any> {
    const message: ReplyMessageRequest = {
      replyToken,
      messages: [{ type: 'text', text }]
    };

    return this.lineClient.replyMessage(message);
  }

  private formatDailyMarketInfoToFlexMessage(data: object[][]): FlexMessage {
    const bubbles: FlexBubble[] = data.map(item => {
      const changeValue = parseFloat(item[5].toString());
      const changeColor = changeValue >= 0 ? '#E63946' : '#2A9D8F'; // 漲用紅色，跌用綠色

      return {
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: '台股日交易資訊',
              weight: 'bold',
              size: 'xl',
              color: '#333333',
              margin: 'md'
            },
            {
              type: 'text',
              text: item[0].toString(),
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
                      text: item[4].toString(),
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
                      text: item[5].toString(),
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
                          text: item[1].toString(),
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
                          text: item[2].toString(),
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
                          text: item[3].toString(),
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

  private formatStockInfoToFlexMessage(stockInfo: any[]): FlexMessage {
    // 修正漲跌符號處理
    const upDownSign = stockInfo[9]?.toString()?.trim().replace(/<[^>]*>/g, '') || '';
    const getUpDownSign = (sign: string) => {
      if (sign.includes('+')) return '+';
      if (sign.includes('-')) return '-';
      return '';
    };
    const actualUpDownSign = getUpDownSign(upDownSign);

    const changeAmount = parseFloat(stockInfo[10]?.toString() || '0') || 0;
    const openPrice = parseFloat(stockInfo[5]?.toString() || '0') || 0;
    const changeColor = upDownSign === "+" ? "#E63946" : upDownSign === "-" ? "#2A9D8F" : "#333333";
    const percentageChange = openPrice !== 0 ? `${(changeAmount / openPrice * 100).toFixed(2)}%` : "0.00%";

    return {
      type: "flex",
      altText: `${stockInfo[1]} (${stockInfo[0]}) 股票資訊`,
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
                  text: `${stockInfo[1]} (${stockInfo[0]})`,
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
                      text: stockInfo[8],
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
                      text: `${actualUpDownSign}${changeAmount} (${percentageChange})`,
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
                ["成交股數", stockInfo[2]],
                ["成交金額", stockInfo[4]],
                ["成交筆數", stockInfo[3]],
                ["開盤價", stockInfo[5]],
                ["最高價", stockInfo[6]],
                ["最低價", stockInfo[7]]
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

  private formatTopTenToFlexMessage(stockData: any[][]): FlexMessage {
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
            const upDownSign = item[9]?.toString()?.trim().replace(/<[^>]*>/g, '') || '';
            const changeAmount = parseFloat(item[10]?.toString() || '0') || 0;
            const openPrice = parseFloat(item[5]?.toString() || '0') || 0;
            const changeColor = upDownSign.includes('+') ? '#E63946' :
              upDownSign.includes('-') ? '#2A9D8F' : '#333333';
            const percentageChange = openPrice !== 0 ?
              `${(changeAmount / openPrice * 100).toFixed(2)}%` : "0.00%";

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
                      text: `${index + 1}. ${item[2].replace(/\s+/g, '')}(${item[1].replace(/\s+/g, '')}) ${upDownSign.includes('+') ? "📈" : upDownSign.includes('-') ? "📉" : "➖"}`, // 組合文字，移除空格
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
                        { type: 'text', text: item[3]?.toString() || '0', size: 'xs', color: '#333333', align: 'end', flex: 7 }
                      ]
                    },
                    {
                      type: 'box',
                      layout: 'horizontal',
                      contents: [
                        { type: 'text', text: '成交筆數', size: 'xs', color: '#666666', flex: 3 },
                        { type: 'text', text: item[4]?.toString() || '0', size: 'xs', color: '#333333', align: 'end', flex: 7 }
                      ]
                    },
                    {
                      type: 'box',
                      layout: 'horizontal',
                      contents: [
                        { type: 'text', text: '開盤價', size: 'xs', color: '#666666', flex: 3 },
                        { type: 'text', text: item[5]?.toString() || '0', size: 'xs', color: '#333333', align: 'end', flex: 7 }
                      ]
                    },
                    {
                      type: 'box',
                      layout: 'horizontal',
                      contents: [
                        { type: 'text', text: '收盤價', size: 'xs', color: '#666666', flex: 3 },
                        { type: 'text', text: item[8]?.toString() || '0', size: 'xs', color: changeColor, align: 'end', flex: 7, weight: 'bold' }
                      ]
                    },
                    {
                      type: 'box',
                      layout: 'horizontal',
                      contents: [
                        { type: 'text', text: '漲跌幅', size: 'xs', color: '#666666', flex: 3 },
                        { type: 'text', text: `${upDownSign}${changeAmount} (${percentageChange})`, size: 'xs', color: changeColor, align: 'end', flex: 7 }
                      ]
                    },
                    {
                      type: 'box',
                      layout: 'horizontal',
                      contents: [
                        { type: 'text', text: '最高價', size: 'xs', color: '#666666', flex: 3 },
                        { type: 'text', text: item[6]?.toString() || '0', size: 'xs', color: '#333333', align: 'end', flex: 7 }
                      ]
                    },
                    {
                      type: 'box',
                      layout: 'horizontal',
                      contents: [
                        { type: 'text', text: '最低價', size: 'xs', color: '#666666', flex: 3 },
                        { type: 'text', text: item[7]?.toString() || '0', size: 'xs', color: '#333333', align: 'end', flex: 7 }
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
