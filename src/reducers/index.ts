import { combineReducers, Store as ReduxStore } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import * as CurrentUser from '../models/CurrentUser';
import * as ErrorLogs from '../models/ErrorLogs';
import * as Rooms from '../models/Rooms';

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

export default combineReducers<IState>({
  currentUser: CurrentUser.reduceCurrentUser,
  errorLogs: ErrorLogs.reduceErrorLogs,
  rooms: Rooms.reduceRooms,
});
