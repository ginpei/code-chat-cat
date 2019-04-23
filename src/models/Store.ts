import { combineReducers, Store as ReduxStore } from 'redux';
import { applyMiddleware, createStore } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import thunk from 'redux-thunk';
import * as CurrentUser from './CurrentUser';
import * as ErrorLogs from './ErrorLogs';
import * as Rooms from './Rooms';

// tslint:disable-next-line:interface-name
export interface AppState {
  currentUser: CurrentUser.ICurrentUserState;
  errorLogs: ErrorLogs.IErrorLog[];
  rooms: Rooms.IRoomState;
}

export type AppAction =
  | CurrentUser.CurrentUserAction
  | ErrorLogs.ErrorsAction
  | Rooms.RoomsAction;
export type AppDispatch = ThunkDispatch<AppState, void, AppAction>;
export type AppStore = ReduxStore<AppState, AppAction>;

export function createAppStore () {
  const rootReducer = combineReducers<AppState>({
    currentUser: CurrentUser.reduceCurrentUser,
    errorLogs: ErrorLogs.reduceErrorLogs,
    rooms: Rooms.reduceRooms,
  });

  const store = createStore<AppState, AppAction, {}, {}>(
    rootReducer,
    applyMiddleware<AppState, AppAction>(thunk),
  );

  return store;
}
