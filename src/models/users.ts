import firebase from '../middleware/firebase';
import { IState, Store } from '../reducers';
import { CurrentUserActionTypes, IUserProfile, IUserProfileRecord } from '../reducers/currentUser';
import migrateUser, { userVersion } from './users.migration';

const usersRef = firebase.firestore().collection('/users');

export async function initializeCurrentUser (store: Store) {
  const unsubscribeAuth = firebase.auth().onAuthStateChanged(
    (user) => store.dispatch({
      type: CurrentUserActionTypes.setFirebaseUser,
      user,
    }),
    (error) => console.error('TODO', error), // TODO
  );

  let lastUserId = '';
  let unsubscribeDatabase: () => void = () => undefined;
  const unsubscribeStore = store.subscribe(async () => {
    const state: IState = store.getState();
    const { firebaseUser } = state.currentUser;
    const uid = firebaseUser ? firebaseUser.uid : '';
    if (uid !== lastUserId) {
      unsubscribeDatabase();
      lastUserId = uid;

      if (uid) {
        const firstSnapshot = await usersRef.doc(uid).get();

        if (!firstSnapshot.exists) {
          await initializeUser(firebaseUser!);
        }

        unsubscribeDatabase = usersRef.doc(uid).onSnapshot((snapshot) => {
          const profile = snapshotToUser(snapshot);
          store.dispatch({
            profile,
            type: CurrentUserActionTypes.setProfile,
          });

          getReady(store);
        }, (error) => console.log('ERR', error));
      }
    } else if (uid && !state.currentUser.profile) {
      // probably the user is logged in and yet fetching profile
      // so do nothing here
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

function getReady (store: Store) {
  if (!store.getState().currentUser.ready) {
    // if not wait, store subscriber won't be called back in App.tsx
    // when not logged in and hot module replacement happened
    // (why??)
    setTimeout(() => {
      store.dispatch({
        ready: true,
        type: CurrentUserActionTypes.setReady,
      });
    }, 1);
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
    id: firebaseUser.uid,
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