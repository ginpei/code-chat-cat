import firebase from 'firebase';
import { createBrowserHistory } from 'history';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import rootReducer, { Action, IState } from './reducers';

export const noop: () => void = () => undefined;

export const appHistory = createBrowserHistory();
export const store = createStore<IState, Action, {}, {}>(
  rootReducer,
  applyMiddleware<IState, Action>(thunk),
);

export interface IRecord {
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
  modelVersion: string;
}

export type ClientRecord<T> = {
  [P in Exclude<keyof T, 'modelVersion'>]: T[P];
} & { id: string; };

export type Migrations = { [key in string]: (v: any) => any };

export function isRecord (record: any): record is IRecord {
  return 'createdAt' in record && 'updatedAt' in record && 'modelVersion' in record;
}

// TODO remove default (wow)
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

// tslint:disable-next-line:ban-types
export function debounce<F extends Function> (fn: F, delay: number): F {
  let tm = 0;
  return function (this: any, ...args: any[]) {
    window.clearTimeout(tm);
    tm  = window.setTimeout(() => fn.apply(this, args), delay);
  } as any;
}
