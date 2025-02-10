import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column } from 'typeorm';

export abstract class BaseEntity {
  // 自動生成主鍵 id
  @PrimaryGeneratedColumn()
  id: number;

  // 新增資料時，自動設定建立時間
  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  // 更新資料時，自動更新時間
  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  // 資料狀態 0: 關閉 ,1: 開啟 
  @Column({ default: 1 })
  status: number;
}
