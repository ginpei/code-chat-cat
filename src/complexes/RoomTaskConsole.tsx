import React, {
  ChangeEvent, FormEvent, KeyboardEvent, useState,
} from 'react';
import styled from 'styled-components';
import Markdown from '../independents/Markdown';
import firebase from '../middleware/firebase';
import { Room, useRoomStudents, RoomStudent } from '../models/Rooms';
import {
  createNewRoomTask, deleteRoomTask, RoomTask, useRoomTasks, useRoomTaskStatuses, RoomTaskStatus,
} from '../models/RoomTasks';
import SimpleError from '../independents/SimpleError';

const TaskProgressLineOuter = styled.div`
  cursor: pointer;
  background-color: lightgray;
  height: 0.5em;
  width: 100%;
`;

const TaskProgressLineInner = styled.div`
  background-color: #036;
  height: 100%;
  width: 0;
`;

const TaskProgressNames = styled.div`
  color: gray;
  font-size: 0.8em;
`;

const TaskProgressLine: React.FC<{
  doneStudents: RoomStudent[],
  undoneStudents: RoomStudent[],
}> = ({ doneStudents, undoneStudents }) => {
  const numStudents = doneStudents.length + undoneStudents.length;
  const progress = doneStudents.length / numStudents;
  const sDoneNames = doneStudents.map((v) => v.name).join(', ') || '(None)';
  const sUndoneNames = undoneStudents.map((v) => v.name).join(', ') || '(None)';

  const [open, setOpen] = useState(false);

  const onClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <TaskProgressLineOuter onClick={onClick}>
        <TaskProgressLineInner style={{ width: `${100 * progress}%` }} />
      </TaskProgressLineOuter>
      {open && (
        <TaskProgressNames>
          <div>✔ {sDoneNames} ({doneStudents.length})</div>
          <div>… {sUndoneNames} ({undoneStudents.length})</div>
        </TaskProgressNames>
      )}
    </>
  );
};

function mapStatusToStudent(statuses: RoomTaskStatus[], students: RoomStudent[]) {
  const doneStudents: RoomStudent[] = [];
  const undoneStudents: RoomStudent[] = [];

  students.forEach((student) => {
    const status = statuses.find((v) => v.userId === student.id);
    if (status && status.done) {
      doneStudents.push(student);
    } else {
      undoneStudents.push(student);
    }
  });

  return { doneStudents, undoneStudents };
}

const TaskListItem: React.FC<{
  onDeleteClick: (task: RoomTask) => void;
  room: Room,
  task: RoomTask,
}> = (props) => {
  const { task, room } = props;

  const [students] = useRoomStudents(
    firebase.firestore(),
    room,
  );

  const [statuses, statusesInitialized, statusesError] = useRoomTaskStatuses(
    firebase.firestore(),
    task,
  );

  const { doneStudents, undoneStudents } = statusesInitialized
    ? mapStatusToStudent(statuses, students)
    : { doneStudents: [], undoneStudents: [] };

  const onDeleteClick = () => {
    props.onDeleteClick(task);
  };

  if (statusesError) {
    return (
      <SimpleError error={statusesError} />
    );
  }

  return (
    <div>
      <button onClick={onDeleteClick} style={{ float: 'right' }}>×</button>
      <Markdown content={task.title} />
      <TaskProgressLine
        doneStudents={doneStudents}
        undoneStudents={undoneStudents}
      />
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

  const onKeyPress = (event: KeyboardEvent) => {
    const isModified = event.ctrlKey || event.metaKey;
    if (event.key === 'Enter' && isModified) {
      onSubmit(event); // are you sure this works?
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <p>
        Title:
        <br/>
        <textarea
          disabled={creating}
          onChange={onTitleChange}
          onKeyPress={onKeyPress}
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
      <SimpleError error={tasksError} />
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
          room={room}
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
