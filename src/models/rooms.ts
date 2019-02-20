import firebase from '../middleware/firebase';
import { IRoom } from '../reducers/rooms';

const roomsRef = firebase.firestore().collection('/rooms');

export async function loadActiveRooms (): Promise<IRoom[]> {
  const snapshot = await roomsRef
    .where('active', '==', true)
    .get();
  return snapshot.docs.map((v) => snapshotToRoom(v)!);
}

export async function loadOwnRooms (userId: string): Promise<IRoom[]> {
  const snapshot = await roomsRef
    .where('userId', '==', userId)
    .get();
  return snapshot.docs.map((v) => snapshotToRoom(v)!);
}

type ConnectRoomCallback = (room: IRoom | null) => void;
type ConnectRoomErrorCallback = (error: Error) => void;
export function connectRoom (
  id: string,
  callback: ConnectRoomCallback,
  onError?: ConnectRoomErrorCallback,
): () => void {
  return roomsRef.doc(id).onSnapshot((snapshot) => {
    const room = snapshotToRoom(snapshot);
    callback(room);
  }, onError);
}

export async function updateRoom (room: IRoom): Promise<void> {
  const record = roomToRecord(room);
  return roomsRef.doc(room.id).update(record);
}

type RoomObserver = (error: Error | null, room?: IRoom | null) => void;
export function observeRoom (id: string, observer: RoomObserver): () => void {
  const ref = roomsRef.doc(id);
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
    active: data.active,
    id: snapshot.id,
    name: data.name,
    textbookContent: data.textbookContent,
    userId: data.userId,
  };
}

function roomToRecord (room: IRoom) {
  return {
    active: room.active,
    name: room.name,
    textbookContent: room.textbookContent,
    userId: room.userId,
  };
}
