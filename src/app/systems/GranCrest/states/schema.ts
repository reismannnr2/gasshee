import z from 'zod';

const ability = z.object({
  id: z.string(),
  特技名: z.string(),
  LV: z.number(),
  種別: z.string(),
  判定: z.string(),
  目標値: z.string(),
  対象: z.string(),
  射程: z.string(),
  コスト: z.string(),
  MC: z.string(),
  制限: z.string(),
  出典: z.string(),
  備考: z.string(),
});
