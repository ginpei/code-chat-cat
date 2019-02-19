import { Store } from 'redux';
import firebase from '../middleware/firebase';
import { CurrentUserActionTypes } from '../reducers/currentUser';

export function initialize (store: Store) {
  return new Promise<firebase.User | null>((resolve, reject) => {
    firebase.auth().onAuthStateChanged(
      (user) => {
        store.dispatch({ type: CurrentUserActionTypes.setUser, user });
        resolve(user);
      },
      (error) => reject(error),
    );
  });
}

export function logIn () {
  const email = 'test@example.com';
  const password = 'pass123';
  return firebase.auth().signInWithEmailAndPassword(email, password);
}

export function logOut () {
  return firebase.auth().signOut();
}
