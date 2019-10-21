import { useEffect, useState } from 'react';
import firebase from '../middleware/firebase';
import { noop } from '../misc';

const collectionName = 'profiles';

export function useProfile(
  auth: firebase.auth.Auth,
  firestore: firebase.firestore.Firestore,
): [Profile | null, boolean, Error | firebase.auth.Error | null] {
  const [error, setError] = useState<Error | firebase.auth.Error | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [user, setUser] = useState<firebase.User | null>(null);
  const [userInitialized, setUserInitialized] = useState(false);

  // user
  useEffect(() => auth.onAuthStateChanged(
    (currentUser) => {
      setUser(currentUser);
      setUserInitialized(true);
    },
    (err) => {
      setError(err);
      setUserInitialized(true);
      setInitialized(true);
    },
  ), [auth]);

  useEffect(() => {
    if (!userInitialized) {
      return noop;
    }

    if (!user) {
      setInitialized(true);
      return noop;
    }

    return getColl(firestore).doc(user.uid).onSnapshot(
      (ss) => {
        const result = snapshotToProfile(ss);
        setProfile(result);
        setInitialized(true);
      },
      (err) => {
        setError(err);
        setInitialized(true);
      },
    );
  }, [user, firestore, userInitialized]);

  return [profile, initialized, error];
}

export async function createNewProfile(
  firestore: firebase.firestore.Firestore,
  profile: Profile,
) {
  await getColl(firestore).doc(profile.id).set(profile);
}

export async function saveProfile2(
  firestore: firebase.firestore.Firestore,
  profile: Profile,
) {
  await getColl(firestore).doc(profile.id).set(profile);
}

function getColl(firestore: firebase.firestore.Firestore) {
  return firestore.collection(collectionName);
}

// ----------------------------------------------------------------------------
// states

export interface Profile {
  id: string;
  message?: string;
  name: string;
  type: ProfileType;
}

export enum ProfileType {
  'anonymous',
  'loggedIn',
}

export const emptyProfile: Readonly<Profile> = Object.freeze({
  id: '',
  message: '',
  name: '',
  type: ProfileType.anonymous,
});

export function getInitialProfile (userId: string): Profile {
  return {
    ...emptyProfile,
    id: userId,
    name: 'No name',
  };
}

// ----------------------------------------------------------------------------
// connectors

export function connectProfile (
  userId: string,
  onNext: (profile: Profile) => void,
  onError: (error: Error) => void = noop,
  onEach: () => void = noop,
): () => void {
  if (!userId) {
    onEach();
    return noop;
  }

  const userRef = firebase.firestore().collection(collectionName).doc(userId);
  const unsubscribeNotes = userRef.onSnapshot(
    (snapshot) => {
      const profile = snapshotToProfile(snapshot) || getInitialProfile(userId);
      onNext(profile);
      onEach();
    },
    (error) => {
      onError(error);
      onEach();
    },
  );
  return unsubscribeNotes;
}

export function saveProfile (profile: Profile) {
  const userRef = firebase.firestore().collection(collectionName).doc(profile.id);
  return userRef.set(profile);
}

export function snapshotToProfile (
  snapshot: firebase.firestore.DocumentSnapshot,
): Profile | null {
  const data = snapshot.data();
  if (!data) {
    return null;
  }

  return {
    id: data.id || '',
    message: data.message || '',
    name: data.name || '',
    type: data.type in ProfileType ? data.type : ProfileType.anonymous,
  };
}
