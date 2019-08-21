import firebase from '../middleware/firebase';

export type AppError =
  | Error
  | firebase.auth.Error;

export interface ErrorLog {
  error: AppError;
  id: string;
  occurredAt: number;
}

function createLog (error: AppError): ErrorLog {
  const occurredAt = Date.now();
  const random = String(Math.random()).slice(2);
  const id = `${occurredAt}${random}`;
  return { error, id, occurredAt };
}

// ----------------------------------------------------------------------------
// actions

interface AddAction {
  log: ErrorLog;
  type: 'ErrorLogs/add';
}

export function add (location: string, error: AppError): AddAction {
  console.error(`[${location}]`, error); // TODO
  return {
    log: createLog(error),
    type: 'ErrorLogs/add',
  };
}

interface ClearAction {
  type: 'ErrorLogs/clear';
}

export function clear (): ClearAction {
  return {
    type: 'ErrorLogs/clear',
  };
}

export type ErrorsAction =
  | AddAction
  | ClearAction;

// ----------------------------------------------------------------------------
// reducers

export function reduceErrorLogs (
  state: ErrorLog[] = [],
  action: ErrorsAction,
): ErrorLog[] {
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
