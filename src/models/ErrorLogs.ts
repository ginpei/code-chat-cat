import firebase from '../middleware/firebase';

export type AppError =
  | Error
  | firebase.auth.Error;

export interface IErrorLog {
  error: AppError;
  id: string;
  occurredAt: number;
}

function createLog (error: AppError): IErrorLog {
  const occurredAt = Date.now();
  const random = String(Math.random()).slice(2);
  const id = `${occurredAt}${random}`;
  return { error, id, occurredAt };
}

// ----------------------------------------------------------------------------
// actions

interface IAddAction {
  log: IErrorLog;
  type: 'ErrorLogs/add';
}

export function add (location: string, error: AppError): IAddAction {
  console.error(`[${location}]`, error); // TODO
  return {
    log: createLog(error),
    type: 'ErrorLogs/add',
  };
}

interface IClearAction {
  type: 'ErrorLogs/clear';
}

export function clear (): IClearAction {
  return {
    type: 'ErrorLogs/clear',
  };
}

export type ErrorsAction =
  | IAddAction
  | IClearAction;

// ----------------------------------------------------------------------------
// reducers

export function reduceErrorLogs (
  state: IErrorLog[] = [],
  action: ErrorsAction,
): IErrorLog[] {
  switch (action.type) {
    case 'ErrorLogs/add': {
      const logs = [...state];
      logs.push(action.log);
      return logs;
    }
    case 'ErrorLogs/clear':
      return [];
    default:
      return state;
  }
}
