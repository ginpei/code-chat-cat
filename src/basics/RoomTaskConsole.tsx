import React, { ChangeEvent, FormEvent, useState } from 'react';
import firebase from '../middleware/firebase';
import { Room } from '../models/Rooms';
import { createNewRoomTask, deleteRoomTask, useRoomTasks } from '../models/RoomTasks';

type Task = {
  id: string;
  index: number;
  title: string;
}

const TaskListItem: React.FC<{
  onDeleteClick: (task: Task) => void;
  task: Task,
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
  onSubmit: (task: Task) => void;
}> = (props) => {
  const [title, setTitle] = useState('');

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    props.onSubmit({ id: `${Date.now()}`, index: 0, title });
    setTitle('');
  };

  const onTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setTitle(value);
  };

  return (
    <form onSubmit={onSubmit}>
      <label>
        {'Title: '}
        <input
          onChange={onTitleChange}
          type="text"
          value={title}
        />
      </label>
      <button type="submit">Add</button>
    </form>
  );
};

const RoomTaskConsole: React.FC<{ room: Room }> = ({ room }) => {
  const [tasks, tasksInitialized, tasksError] = useRoomTasks(
    firebase.firestore(),
    room.id,
  );

  const onDeleteTaskClick = (task: Task) => {
    const message = 'Are you sure you want to delete this task?';
    const ok = window.confirm(`${message}\n\n${task.title}`);
    if (ok) {
      deleteRoomTask(firebase.firestore(), room.id, task);
    }
  };

  const onSubmit = (newTask: Task) => {
    createNewRoomTask(firebase.firestore(), room.id, newTask);
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
