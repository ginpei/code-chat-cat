import { Store as ReduxStore } from 'redux';
import { combineReducers } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import * as CurrentUser from '../models/CurrentUser';
import * as ErrorLogs from '../models/ErrorLogs';
import * as Rooms from '../models/Rooms';
import currentUser, { CurrentUserAction, ICurrentUser } from './currentUser';
import rooms, { IRoomState, RoomsAction } from './rooms';

export interface IState {
  currentUser: CurrentUser.ICurrentUserState;
  // currentUser0: ICurrentUser;
  errorLogs: ErrorLogs.IErrorLog[];
  rooms: Rooms.IRoomState;
  rooms0: IRoomState;
}

export type Action =
  | CurrentUser.CurrentUserAction
  | CurrentUserAction
  | ErrorLogs.ErrorsAction
  | RoomsAction
  | Rooms.RoomsAction;
export type Dispatch = ThunkDispatch<IState, void, Action>;
export type Store = ReduxStore<IState, Action>;

export default combineReducers<IState>({
  currentUser: CurrentUser.reduceCurrentUser,
  // currentUser0: currentUser,
  errorLogs: ErrorLogs.reduceErrorLogs,
  rooms: Rooms.reduceRooms,
  rooms0: rooms,
});
