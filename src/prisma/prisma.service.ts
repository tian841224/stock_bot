import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    
    if (process.env.NODE_ENV !== 'production') {
      try {
        // 檢查是否存在 User 資料表（代表資料庫已初始化）
        const tableExists = await this.checkTableExists('User');
        
        if (!tableExists) {
          console.log('🔄 偵測到資料表不存在，正在建立資料庫結構...');
          await execAsync('npx prisma db push');
          console.log('✅ 資料庫結構建立成功');
        } else {
          console.log('✅ 資料庫連線成功，資料表已存在');
        }
      } catch (error) {
        console.error('❌ 資料庫檢查失敗:', error);
        // 如果檢查失敗，嘗試執行 db push
        try {
          console.log('🔄 嘗試建立資料庫結構...');
          await execAsync('npx prisma db push');
          console.log('✅ 資料庫結構建立成功');
        } catch (pushError) {
          console.error('❌ 資料庫建立失敗:', pushError);
        }
      }
    } else {
      console.log('✅ 資料庫連線成功');
    }
  }

  private async checkTableExists(tableName: string): Promise<boolean> {
    try {
      // PostgreSQL 版本
      const result = await this.$queryRaw<Array<{ exists: boolean }>>`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = ${tableName}
        );
      `;
      return result[0]?.exists || false;
    } catch (error) {
      // 如果查詢失敗，假設資料表不存在
      return false;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
