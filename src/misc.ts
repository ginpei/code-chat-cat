import firebase from 'firebase';
import { createBrowserHistory } from 'history';

export const appHistory = createBrowserHistory();

export interface IRecord {
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
  modelVersion: string;
}

export type ClientRecord<T> = {
  [P in Exclude<keyof T, 'modelVersion'>]: T[P];
} & { id: string; };

export type Migrations = { [key in string]: (v: IRecord) => IRecord };

export function isRecord (record: any): record is IRecord {
  return 'createdAt' in record && 'updatedAt' in record && 'modelVersion' in record;
}

export default function migrate (migrations: Migrations, record: any) {
  const startedAt = Date.now();
  while (true) {
    // most likely infinite loop
    if (Date.now() - startedAt > 3000) {
      throw new Error('Timed out');
    }

    if (!isRecord(record)) {
      console.warn(record);
      throw new Error('Invalid record data');
    }

    const { modelVersion } = record;
    const proceed = migrations[modelVersion];
    if (!proceed) {
      throw new Error(`Migration not found: ${modelVersion}`);
    }

    const result = proceed(record);
    if (result.modelVersion === record.modelVersion) {
      return result;
    }

    record = result;
  }
}
