import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Room } from '../models/Rooms';

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
  const [tasks, setTasks] = useState<Task[]>([]);

  const onDeleteTaskClick = (task: Task) => {
    const message = 'Are you sure you want to delete this task?';
    const ok = window.confirm(`${message}\n\n${task.title}`);
    if (ok) {
      setTasks(tasks.filter((v) => v !== task));
    }
  };

  const onSubmit = (newTask: Task) => {
    const index = tasks.length > 0
      ? tasks[tasks.length - 1].index + 1
      : 1;
    setTasks([...tasks, { ...newTask, index }]);
  };

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
