import { Store as ReduxStore } from 'redux';
import { combineReducers } from 'redux';
import * as CurrentUser from '../models/CurrentUser';
import currentUser, { CurrentUserAction, ICurrentUser } from './currentUser';
import rooms, { IRoomState, RoomsAction } from './rooms';

export interface IState {
  currentUser: CurrentUser.ICurrentUserState;
  currentUser0: ICurrentUser;
  rooms: IRoomState;
}

export type Action =
  | CurrentUser.CurrentUserAction
  | CurrentUserAction
  | RoomsAction;
export type Dispatch = (action: Action) => void;
export type Store = ReduxStore<IState, Action>;

export default combineReducers<IState>({
  currentUser: CurrentUser.reduceCurrentUser,
  currentUser0: currentUser,
  rooms,
});
