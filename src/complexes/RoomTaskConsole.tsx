import React, { ChangeEvent, FormEvent, useState } from 'react';
import firebase from '../middleware/firebase';
import { Room } from '../models/Rooms';
import {
  createNewRoomTask, deleteRoomTask, RoomTask, useRoomTasks,
} from '../models/RoomTasks';

const TaskListItem: React.FC<{
  onDeleteClick: (task: RoomTask) => void;
  task: RoomTask,
}> = (props) => {
  const { task } = props;

  const onDeleteClick = () => {
    props.onDeleteClick(task);
  };

  return (
    <div>
      <button onClick={onDeleteClick} style={{ float: 'right' }}>×</button>
      <p>{task.title}</p>
    </div>
  );
};

const NewRoomTaskForm: React.FC<{
  onSubmit: (task: RoomTask) => Promise<void>;
}> = (props) => {
  const [title, setTitle] = useState('');
  const [creating, setCreating] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setCreating(true);
    await props.onSubmit({
      id: `${Date.now()}`,
      index: 0,
      roomId: '',
      title,
    });
    setCreating(false);
    setTitle('');
  };

  const onTitleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.currentTarget;
    setTitle(value);
  };

  return (
    <form onSubmit={onSubmit}>
      <p>
        Title:
        <br/>
        <textarea
          disabled={creating}
          onChange={onTitleChange}
          value={title}
        />
      </p>
      <button disabled={creating} type="submit">Add</button>
    </form>
  );
};

const RoomTaskConsole: React.FC<{ room: Room }> = ({ room }) => {
  const roomId = room.id;

  const [tasks, tasksInitialized, tasksError] = useRoomTasks(
    firebase.firestore(),
    roomId,
  );

  const onDeleteTaskClick = (task: RoomTask) => {
    const message = 'Are you sure you want to delete this task?';
    const ok = window.confirm(`${message}\n\n${task.title}`);
    if (ok) {
      deleteRoomTask(firebase.firestore(), task);
    }
  };

  const onSubmit = async (newTask: RoomTask) => {
    await createNewRoomTask(firebase.firestore(), { ...newTask, roomId });
  };

  if (tasksError) {
    return (
      <div>Error: {tasksError.message || '(Unknown)'}</div>
    );
  }

  if (!tasksInitialized) {
    return (
      <div>…</div>
    );
  }

  return (
    <div className="RoomTaskConsole">
      {tasks.map((task) => (
        <TaskListItem
          key={task.id}
          onDeleteClick={onDeleteTaskClick}
          task={task}
        />
      ))}
      <NewRoomTaskForm
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default RoomTaskConsole;
