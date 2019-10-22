import { useState, useEffect } from 'react';

export type RoomTask = {
  id: string;
  index: number;
  roomId: string;
  title: string;
}

export function useRoomTasks(
  firestore: firebase.firestore.Firestore,
  roomId: string,
): [RoomTask[], boolean, Error | null] {
  const [tasks, setTasks] = useState<RoomTask[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const ref = getColl(firestore, roomId).orderBy('index');
    return ref.onSnapshot({
      next(ss) {
        const newTasks = ss.docs.map((v) => ssToRoomTask(roomId, v));
        setTasks(newTasks);
        setInitialized(true);
      },
      error(e) {
        setError(e);
        setInitialized(true);
      },
    });
  }, [firestore, roomId]);

  return [tasks, initialized, error];
}

export async function createNewRoomTask(
  firestore: firebase.firestore.Firestore,
  task: RoomTask,
) {
  const lastTask = await getLastRoomTask(firestore, task.roomId);
  const index = lastTask ? lastTask.index + 1 : 1;

  const data = roomTaskToData({ ...task, index });
  await getColl(firestore, task.roomId).add(data);
}

export async function deleteRoomTask(
  firestore: firebase.firestore.Firestore,
  task: RoomTask,
) {
  await getColl(firestore, task.roomId).doc(task.id).delete();
}

function getColl(
  firestore: firebase.firestore.Firestore,
  roomId: string,
) {
  return firestore
    .collection('rooms').doc(roomId)
    .collection('tasks');
}

async function getLastRoomTask(
  firestore: firebase.firestore.Firestore,
  roomId: string,
) {
  const coll = getColl(firestore, roomId);
  const ssLastTasks = await coll
    .orderBy('index', 'desc')
    .limit(1)
    .get();
  const ssLastTask = ssLastTasks.docs[0];
  if (!ssLastTask) {
    return null;
  }

  const lastTask = ssToRoomTask(roomId, ssLastTask);
  return lastTask;
}

function ssToRoomTask(roomId: string, ss: firebase.firestore.QueryDocumentSnapshot) {
  const data = ss.data() || {};

  const task: RoomTask = {
    id: ss.id,
    index: Number(data.index) || 0,
    roomId,
    title: data.title || '',
  };
  return task;
}

function roomTaskToData(task: RoomTask) {
  return {
    index: task.index,
    title: task.title,
  };
}
