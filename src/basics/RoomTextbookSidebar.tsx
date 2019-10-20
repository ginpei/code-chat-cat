import React from 'react';
import styled from 'styled-components';
import { Room } from '../models/Rooms';
import RoomIndexList from './RoomIndexList';
import SidebarSection from './RoomSidebarSection';

const RoomTextbookSidebarOuter = styled.div`
  padding-bottom: 5em;
`;

const RoomTextbookSidebar: React.FC<{ room: Room }> = ({ room }) => (
  <RoomTextbookSidebarOuter className="RoomTextbookSidebar">
    <SidebarSection heading="Index">
      <RoomIndexList room={room} />
    </SidebarSection>
  </RoomTextbookSidebarOuter>
);

export default RoomTextbookSidebar;
