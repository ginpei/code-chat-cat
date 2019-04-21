import { Store as ReduxStore } from 'redux';
import { combineReducers } from 'redux';
import * as CurrentUser from '../models/CurrentUser';
import * as ErrorLogs from '../models/ErrorLogs';
import currentUser, { CurrentUserAction, ICurrentUser } from './currentUser';
import rooms, { IRoomState, RoomsAction } from './rooms';

export interface IState {
  currentUser: CurrentUser.ICurrentUserState;
  currentUser0: ICurrentUser;
  errorLogs: ErrorLogs.IErrorLog[];
  rooms: IRoomState;
}

export type Action =
  | CurrentUser.CurrentUserAction
  | CurrentUserAction
  | ErrorLogs.ErrorsAction
  | RoomsAction;
export type Dispatch = (action: Action) => void;
export type Store = ReduxStore<IState, Action>;

export default combineReducers<IState>({
  currentUser: CurrentUser.reduceCurrentUser,
  currentUser0: currentUser,
  errorLogs: ErrorLogs.reduceErrorLogs,
  rooms,
});
