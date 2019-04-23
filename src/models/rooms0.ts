import firebase from '../middleware/firebase';
import { IRoom, IRoomRecord } from '../reducers/rooms';
import migrateRoom, { roomVersion } from './rooms.migration';

const roomsRef = firebase.firestore().collection('/rooms');

// export function createRoom (
//   roomData: { name: string; userId: string; },
// ) {
//   return new Promise<IRoom>(async (resolve, reject) => {
//     try {
//       const record: IRoomRecord = {
//         createdAt: firebase.firestore.Timestamp.now(),
//         modelVersion: roomVersion,
//         name: roomData.name,
//         status: RoomStatus.draft,
//         textbookContent: `# ${roomData.name}`,
//         updatedAt: firebase.firestore.Timestamp.now(),
//         userId: roomData.userId,
//       };
//       const docRef = await roomsRef.add(record);

//       const snapshot = await docRef.get();
//       const room = snapshotToRoom(snapshot);
//       if (!room) {
//         throw new Error('Failed to get room');
//       }
//       resolve(room);
//     } catch (error) {
//       reject(error);
//     }
//   });
// }

// export async function updateRoom (room: IRoom): Promise<void> {
//   const record = roomToRecord(room);
//   record.createdAt = record.createdAt || firebase.firestore.Timestamp.now();
//   record.updatedAt = firebase.firestore.Timestamp.now();
//   return roomsRef.doc(room.id).update(record);
// }

export async function deleteRoom (room: IRoom) {
  return roomsRef.doc(room.id).delete();
}

function snapshotToRoom (snapshot: firebase.firestore.DocumentSnapshot): IRoom | null {
  const data = snapshot.data();
  if (!data) {
    return null;
  }

  const migratedData = migrateRoom(data);

  return {
    createdAt: migratedData.createdAt,
    id: snapshot.id,
    name: migratedData.name,
    status: migratedData.status,
    textbookContent: migratedData.textbookContent,
    updatedAt: migratedData.updatedAt,
    userId: migratedData.userId,
  };
}

function roomToRecord (room: IRoom): IRoomRecord {
  return {
    ...room,
    modelVersion: roomVersion,
  };
}
