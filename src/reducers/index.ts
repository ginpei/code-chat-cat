import { Store as ReduxStore } from 'redux';
import { combineReducers } from 'redux';
import currentUser, { CurrentUserAction, ICurrentUser } from './currentUser';
import rooms, { IRoomState, RoomsAction } from './rooms';

export interface IState {
  currentUser0: ICurrentUser;
  rooms: IRoomState;
}

export type Action = CurrentUserAction | RoomsAction;
export type Dispatch = (action: Action) => void;
export type Store = ReduxStore<IState, Action>;

export default combineReducers<IState>({
  currentUser0: currentUser,
  rooms,
});
