import React, { useState } from 'react';
import firebase from '../middleware/firebase';
import { Room } from '../models/Rooms';
import { useRoomTasks, RoomTask } from '../models/RoomTasks';
import Markdown from '../independents/Markdown';

const TaskListItem: React.FC<{ task: RoomTask }> = ({ task }) => {
  const [done, setDone] = useState(false);

  const onDoneClick = () => {
    setDone(!done);
  };

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
      <Markdown content={task.title} />
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
      <div>Error: {tasksError.message || '(Unknown)'}</div>
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
        <TaskListItem key={task.id} task={task} />
      ))}
    </div>
  );
};

export default TextbookTasksSection;
