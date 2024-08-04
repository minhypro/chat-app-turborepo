import { ChatDatabase } from '@/global.type';

export async function doInTransaction(
  db: ChatDatabase,
  callback: (_db: ChatDatabase) => Promise<any>,
) {
  let output: any;
  try {
    await db.exec('BEGIN TRANSACTION');

    output = await callback(db);

    await db.exec('COMMIT');
  } catch (e) {
    await db.exec('ROLLBACK');
    throw e;
  } finally {
    db.close();
  }

  return output;
}
