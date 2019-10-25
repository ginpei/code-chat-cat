import { useState, useEffect } from 'react';

export type RoomTask = {
  id: string;
  index: number;
  roomId: string;
  title: string;
}

export type RoomTaskStatus = {
  done: boolean;
  roomId: string;
  taskId: string;
  userId: string;
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

export function useRoomTaskStatuses(
  firestore: firebase.firestore.Firestore,
  task: RoomTask,
): [RoomTaskStatus[], boolean, Error | null] {
  const [error, setError] = useState<Error | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [statuses, setStatuses] = useState<RoomTaskStatus[]>([]);

  useEffect(() => {
    const ref = getStatusColl(firestore, task.roomId, task.id);
    return ref.onSnapshot({
      next(ss) {
        const newStatus = ss.docs.map((v) => ssToRoomTaskStatus(task, v));
        setStatuses(newStatus);
        setInitialized(true);
      },
      error(e) {
        setError(e);
        setInitialized(true);
      },
    });
  }, [firestore, task]);

  return [statuses, initialized, error];
}

export function useUserRoomTasksStatus(
  firestore: firebase.firestore.Firestore,
  roomId: string,
  taskId: string,
  userId: string,
): [RoomTaskStatus | null, boolean, Error | null] {
  const [error, setError] = useState<Error | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [status, setStatus] = useState<RoomTaskStatus | null>(null);

  useEffect(() => {
    const ref = getStatusColl(firestore, roomId, taskId).doc(userId);
    return ref.onSnapshot({
      next(ss) {
        const newStatus = ss
          ? ssToRoomTaskStatus({ roomId, id: taskId }, ss)
          : {
            done: false,
            roomId,
            taskId,
            userId,
          };
        setStatus(newStatus);
        setInitialized(true);
      },
      error(e) {
        setError(e);
        setInitialized(true);
      },
    });
  }, [firestore, roomId, taskId, userId]);

  return [status, initialized, error];
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

export async function setRoomTaskStatus(
  firestore: firebase.firestore.Firestore,
  status: RoomTaskStatus,
) {
  await getStatusColl(firestore, status.roomId, status.taskId)
    .doc(status.userId)
    .set(roomTaskStatusToData(status));
}

function getColl(
  firestore: firebase.firestore.Firestore,
  roomId: string,
) {
  return firestore
    .collection('rooms').doc(roomId)
    .collection('tasks');
}

function getStatusColl(
  firestore: firebase.firestore.Firestore,
  roomId: string,
  taskId: string,
) {
  return getColl(firestore, roomId).doc(taskId)
    .collection('statuses');
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

function ssToRoomTaskStatus(
  task: Pick<RoomTask, 'id' | 'roomId'>,
  ss: firebase.firestore.DocumentSnapshot,
) {
  const data = ss.data() || {};

  const status: RoomTaskStatus = {
    done: data.done || false,
    roomId: task.roomId,
    taskId: task.id,
    userId: ss.id,
  };
  return status;
}

function roomTaskStatusToData(status: RoomTaskStatus) {
  return {
    done: status.done,
  };
}
