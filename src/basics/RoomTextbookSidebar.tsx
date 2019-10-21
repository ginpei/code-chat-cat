import React, { useState } from 'react';
import styled from 'styled-components';
import firebase from '../middleware/firebase';
import { Room } from '../models/Rooms';
import { useRoomTasks } from '../models/RoomTasks';
import RoomIndexList from './RoomIndexList';
import SidebarSection from './RoomSidebarSection';

const UserInfoSection: React.FC = () => {
  const [name, setName] = useState('');

  const onNameChangeClick = () => {
    const newName = window.prompt('You name', name);
    if (newName) {
      setName(newName);
    }
  };

  return (
    <div className="UserInfoSection">
      <p>
        <button onClick={onNameChangeClick} style={{ float: 'right' }}>✒</button>
        {`Name: ${name || 'Anonymous'}`}
      </p>
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
    <div>
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

const RoomTextbookSidebarOuter = styled.div`
  padding-bottom: 5em;
`;

const RoomTextbookSidebar: React.FC<{ room: Room }> = ({ room }) => (
  <RoomTextbookSidebarOuter className="RoomTextbookSidebar">
    <SidebarSection heading="You" open>
      <UserInfoSection />
    </SidebarSection>
    <SidebarSection heading="Index">
      <RoomIndexList room={room} />
    </SidebarSection>
    <SidebarSection heading="Tasks">
      <TextbookTasksSection room={room} />
    </SidebarSection>
  </RoomTextbookSidebarOuter>
);

export default RoomTextbookSidebar;
