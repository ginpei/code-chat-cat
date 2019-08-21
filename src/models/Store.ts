import {
  applyMiddleware, combineReducers, createStore, Store as ReduxStore,
} from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import * as CurrentUser from './CurrentUser';
import * as ErrorLogs from './ErrorLogs';
import * as Rooms from './Rooms';

// tslint:disable-next-line:interface-name
export interface AppState {
  currentUser: CurrentUser.CurrentUserState;
  errorLogs: ErrorLogs.ErrorLog[];
  rooms: Rooms.RoomState;
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
