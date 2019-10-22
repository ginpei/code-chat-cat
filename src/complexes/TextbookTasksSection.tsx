import React from 'react';
import Markdown from '../independents/Markdown';
import SimpleError from '../independents/SimpleError';
import firebase from '../middleware/firebase';
import { Room } from '../models/Rooms';
import {
  RoomTask, RoomTaskStatus, setRoomTaskStatus, useRoomTasks, useUserRoomTasksStatus,
} from '../models/RoomTasks';

const TaskListItem: React.FC<{
  task: RoomTask,
}> = (props) => {
  const [status, statusInitialized, statusError] = useUserRoomTasksStatus(
    firebase.firestore(),
    props.task.roomId,
    props.task.id,
    firebase.auth().currentUser!.uid, // TODO
  );

  const done = status && status.done;

  const onDoneClick = async () => {
    const newStatus: RoomTaskStatus = {
      ...status!,
      done: !done,
    };
    await setRoomTaskStatus(firebase.firestore(), newStatus);
  };

  if (statusError) {
    return (
      <SimpleError error={statusError} />
    );
  }

  if (!statusInitialized) {
    return (
      <div>…</div>
    );
  }

  return (
    <div
      className="TaskListItem"
      style={{
        opacity: done ? 0.5 : 1,
      }}
    >
      <button
        onClick={onDoneClick}
        style={{ float: 'right' }}
        title={done ? 'Revert' : 'Done'}
      >
        {done ? '↻' : '✔'}
      </button>
      <Markdown content={props.task.title} />
    </div>
  );
};

const TextbookTasksSection: React.FC<{ room: Room }> = (props) => {
  const { room } = props;

  const [tasks, tasksInitialized, tasksError] = useRoomTasks(
    firebase.firestore(),
    room.id,
  );

  if (tasksError) {
    return (
      <SimpleError error={tasksError} />
    );
  }

  if (!tasksInitialized) {
    return (
      <div>…</div>
    );
  }

  return (
    <div className="TextbookTasksSection">
      {tasks.length < 1 && (
        <p>(No tasks yet)</p>
      )}
      {tasks.map((task) => (
        <TaskListItem
          key={task.id}
          task={task}
        />
      ))}
    </div>
  );
};

export default TextbookTasksSection;
