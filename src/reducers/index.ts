import { combineReducers } from 'redux';
import currentUser from './currentUser';
import rooms from './rooms';

export default combineReducers({
  currentUser,
  rooms,
});
