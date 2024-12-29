import * as line from '@line/bot-sdk';

export function getMiddleware() {
  return line.middleware({
    channelSecret: process.env.CHANNEL_SECRET,
  });
}