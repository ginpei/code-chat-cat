import React from 'react';
import styled from 'styled-components';
import { Room } from '../models/Rooms';
import RoomIndexList from './RoomIndexList';
import RoomSidebarSection from './RoomSidebarSection';
import RoomTaskConsole from './RoomTaskConsole';

const Outer = styled.div`
  padding: 1rem 1rem 5rem;
`;

// eslint-disable-next-line arrow-body-style
const RoomWriteSidebar: React.FC<{ room: Room }> = ({ room }) => {
  return (
    <Outer className="RoomWriteSidebar">
      <RoomSidebarSection heading="Index">
        <RoomIndexList room={room} />
      </RoomSidebarSection>
      <RoomSidebarSection heading="Tasks">
        <RoomTaskConsole room={room} />
      </RoomSidebarSection>
    </Outer>
  );
};

export default RoomWriteSidebar;
