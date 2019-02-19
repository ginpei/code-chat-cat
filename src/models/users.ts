import { Store } from 'redux';
import firebase from '../middleware/firebase';
import { CurrentUserActionTypes } from '../reducers/currentUser';

const usersRef = firebase.firestore().collection('/users');

interface IUser {
  id: string; // aka uid
  name: string;
}

export function initializeCurrentUser (store: Store) {
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

export async function loadUser (userId: string): Promise<IUser | null> {
  const snapshot = await usersRef.doc(userId).get();
  if (!snapshot.exists) {
    return null;
  }
  return snapshotToUser(snapshot);
}

export function initializeUser (firebaseUser: firebase.User) {
  const user: IUser = {
    id: '',
    name: firebaseUser.displayName || firebaseUser.email || 'Anonymous',
  };
  return saveUser(user);
}

export function saveUser (user: IUser) {
  const data = userToData(user);
  return usersRef.doc(user.id).set(data);
}

function snapshotToUser (
  snapshot: firebase.firestore.DocumentSnapshot,
): IUser | null {
  const data = snapshot.data();
  if (!data) {
    return null;
  }

  return {
    id: snapshot.id,
    name: data.name,
  };
}

function userToData (user: IUser) {
  return {
    name: user.name,
  };
}
