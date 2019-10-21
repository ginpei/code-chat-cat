import React from 'react';
import firebase from '../middleware/firebase';
import { Room } from '../models/Rooms';
import { useRoomTasks } from '../models/RoomTasks';

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
        <p>(No tasks)</p>
      )}
      {tasks.map((task) => (
        <div key={task.id}>
          {task.title}
        </div>
      ))}
    </div>
  );
};

export default TextbookTasksSection;
