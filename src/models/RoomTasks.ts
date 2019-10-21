import { useState, useEffect } from 'react';

export type RoomTask = {
  id: string;
  index: number;
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
        const newTasks = ss.docs.map((v) => ssToRoomTask(v));
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
  roomId: string,
  task: RoomTask,
) {
  const lastTask = await getLastRoomTask(firestore, roomId);
  const index = lastTask ? lastTask.index + 1 : 1;

  const newTask = { ...task, index };
  await getColl(firestore, roomId).add(newTask);
}

export async function deleteRoomTask(
  firestore: firebase.firestore.Firestore,
  roomId: string,
  task: RoomTask,
) {
  await getColl(firestore, roomId).doc(task.id).delete();
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

  const lastTask = ssToRoomTask(ssLastTask);
  return lastTask;
}

function ssToRoomTask(ss: firebase.firestore.QueryDocumentSnapshot) {
  const data = ss.data() || {};

  const task: RoomTask = {
    id: ss.id,
    index: Number(data.index) || 0,
    title: data.title || '',
  };
  return task;
}
