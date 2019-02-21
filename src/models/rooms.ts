import firebase from '../middleware/firebase';
import { IRoom, IRoomRecord } from '../reducers/rooms';

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

type ConnectRoomsCallback = (rooms: IRoom[]) => void;
type ConnectRoomsErrorCallback = (error: Error) => void;
export function connectUserRooms (
  userId: string,
  callback: ConnectRoomsCallback,
  onError?: ConnectRoomsErrorCallback,
): () => void {
  return roomsRef.where('userId', '==', userId).onSnapshot((snapshot) => {
    const rooms = snapshot.docs.map((docSnapshot) => snapshotToRoom(docSnapshot)!);
    callback(rooms);
  }, onError);
}

export function createRoom (
  roomData: { name: string; userId: string; },
) {
  return new Promise<IRoom>(async (resolve, reject) => {
    try {
      const record: IRoomRecord = {
        active: false,
        name: roomData.name,
        textbookContent: `# ${roomData.name}`,
        userId: roomData.userId,
      };
      const docRef = await roomsRef.add(record);

      const snapshot = await docRef.get();
      const room = snapshotToRoom(snapshot);
      if (!room) {
        throw new Error('Failed to get room');
      }
      resolve(room);
    } catch (error) {
      reject(error);
    }
  });
}

export async function updateRoom (room: IRoom): Promise<void> {
  const record = roomToRecord(room);
  return roomsRef.doc(room.id).update(record);
}

export async function deleteRoom (room: IRoom) {
  return roomsRef.doc(room.id).delete();
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

function roomToRecord (room: IRoom): IRoomRecord {
  return {
    active: room.active,
    name: room.name,
    textbookContent: room.textbookContent,
    userId: room.userId,
  };
}
