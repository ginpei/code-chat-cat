import { Store } from 'redux';
import firebase from './middleware/firebase';
import { IRoom, RoomsActionTypes } from './reducers/rooms';

export async function loadActiveRooms (user: firebase.User): Promise<IRoom[]> {
  const snapshot = await firebase.firestore().collection('/rooms')
    .where('active', '==', true)
    .get();
  return snapshot.docs.map((ds) => {
    const data = ds.data();
    return {
      id: ds.id,
      name: data.name,
      textbookContent: data.textbookContent,
    };
  });
}

export async function loadRoom (user: firebase.User, roomId: string): Promise<IRoom | null> {
  const snapshot = await firebase.firestore().collection('/rooms').doc(roomId).get();
  const data = snapshot.data();
  if (!data) {
    return null;
  }

  return {
    id: roomId,
    name: data.name,
    textbookContent: data.textbookContent,
  };
}

export async function updateRoom (room: IRoom): Promise<void> {
  const data = {
    name: room.name,
    textbookContent: room.textbookContent,
  };
  return firebase.firestore().collection('/rooms').doc(room.id).update(data);
}

type RoomObserver = (error: Error | null, room?: IRoom | null) => void;
export function observeRoom (id: string, observer: RoomObserver): () => void {
  const ref = firebase.firestore().collection('/rooms').doc(id);
  return ref.onSnapshot((snapshot) => {
    const room = snapshotToRoom(snapshot);
    observer(null, room);
  }, (error) => {
    observer(error);
  });
}

function snapshotToRoom (snapshot: firebase.firestore.DocumentSnapshot): IRoom | null {
  const data = snapshot.data();
  if (!data) {
    return null;
  }

  return {
    id: snapshot.id,
    name: data.name,
    textbookContent: data.textbookContent,
  };
}
