import { combineReducers, Store as ReduxStore } from 'redux';
import { applyMiddleware, createStore } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import thunk from 'redux-thunk';
import * as CurrentUser from './CurrentUser';
import * as ErrorLogs from './ErrorLogs';
import * as Rooms from './Rooms';

export interface IState {
  currentUser: CurrentUser.ICurrentUserState;
  errorLogs: ErrorLogs.IErrorLog[];
  rooms: Rooms.IRoomState;
}

export type Action =
  | CurrentUser.CurrentUserAction
  | ErrorLogs.ErrorsAction
  | Rooms.RoomsAction;
export type Dispatch = ThunkDispatch<IState, void, Action>;
export type Store = ReduxStore<IState, Action>;

export function createAppStore () {
  const rootReducer = combineReducers<IState>({
    currentUser: CurrentUser.reduceCurrentUser,
    errorLogs: ErrorLogs.reduceErrorLogs,
    rooms: Rooms.reduceRooms,
  });

  const store = createStore<IState, Action, {}, {}>(
    rootReducer,
    applyMiddleware<IState, Action>(thunk),
  );

  return store;
}
