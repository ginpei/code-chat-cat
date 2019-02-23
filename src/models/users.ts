import { Store } from 'redux';
import firebase from '../middleware/firebase';
import { Action, IState } from '../reducers';
import { CurrentUserActionTypes, IUserProfile, IUserProfileRecord } from '../reducers/currentUser';
import migrateUser, { userVersion } from './users.migration';

const usersRef = firebase.firestore().collection('/users');

export async function initializeCurrentUser (store: Store<IState, Action>) {
  const unsubscribeAuth = firebase.auth().onAuthStateChanged(
    (user) => store.dispatch({
      type: CurrentUserActionTypes.setFirebaseUser,
      user,
    }),
    (error) => console.error('TODO', error), // TODO
  );

  let lastUserId = '';
  let unsubscribeDatabase: () => void = () => undefined;
  const unsubscribeStore = store.subscribe(() => {
    const state: IState = store.getState();
    const { firebaseUser } = state.currentUser;
    const uid = firebaseUser ? firebaseUser.uid : '';
    if (uid !== lastUserId) {
      unsubscribeDatabase();
      lastUserId = uid;

      if (uid) {
        unsubscribeDatabase = usersRef.doc(uid).onSnapshot((snapshot) => {
          const profile = snapshotToUser(snapshot);
          store.dispatch({
            profile,
            type: CurrentUserActionTypes.setProfile,
          });

          getReady(store);
        });
      }
    } else {
      getReady(store);
    }
  });

  return () => {
    unsubscribeAuth();
    unsubscribeStore();
    unsubscribeDatabase();
  };
}

function getReady (store: Store<IState, Action>) {
  if (!store.getState().currentUser.ready) {
    store.dispatch({
      ready: true,
      type: CurrentUserActionTypes.setReady,
    });
  }
}

export function logIn () {
  const email = 'test@example.com';
  const password = 'pass123';
  return firebase.auth().signInWithEmailAndPassword(email, password);
}

export function logOut () {
  return firebase.auth().signOut();
}

export async function loadUser (userId: string): Promise<IUserProfile | null> {
  const snapshot = await usersRef.doc(userId).get();
  if (!snapshot.exists) {
    return null;
  }
  return snapshotToUser(snapshot);
}

export function initializeUser (firebaseUser: firebase.User) {
  const user: IUserProfile = {
    createdAt: firebase.firestore.Timestamp.now(),
    id: '',
    name: firebaseUser.displayName || firebaseUser.email || 'Anonymous',
    updatedAt: firebase.firestore.Timestamp.now(),
  };
  return saveUser(user);
}

export function saveUser (user: IUserProfile) {
  // store will be updated too when snapshot is updated

  const data = userToData(user);
  return usersRef.doc(user.id).set(data);
}

function snapshotToUser (
  snapshot: firebase.firestore.DocumentSnapshot,
): IUserProfile | null {
  const data = snapshot.data();
  if (!data) {
    return null;
  }

  const migratedData = migrateUser(data);

  return {
    createdAt: migratedData.createdAt,
    id: snapshot.id,
    name: migratedData.name,
    updatedAt: migratedData.updatedAt,
  };
}

function userToData (user: IUserProfile): IUserProfileRecord {
  return {
    ...user,
    modelVersion: userVersion,
  };
}
