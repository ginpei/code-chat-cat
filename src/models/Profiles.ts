import firebase from '../middleware/firebase';
import { noop } from '../misc';

const collectionName = 'profiles';

// ----------------------------------------------------------------------------
// states

export interface Profile {
  id: string;
  message: string;
  name: string;
}

export const emptyProfile: Readonly<Profile> = Object.freeze({
  id: '',
  message: '',
  name: '',
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
  };
}
