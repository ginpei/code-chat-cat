import React from 'react';
import RoomIndexList from './RoomIndexList';
import RoomSidebarOuter from './RoomSidebarOuter';
import RoomSidebarSection from './RoomSidebarSection';
import Emoji from '../independents/Emoji';
import { Room } from '../models/Rooms';

const RoomTextbookSidebarArchived: React.FC<{ room: Room }> = ({ room }) => (
  <RoomSidebarOuter className="RoomTextbookSidebarArchived">
    <p>
      <Emoji label="Package" />
      This room has been archived.
    </p>
    <RoomSidebarSection heading="Index" open>
      <RoomIndexList room={room} />
    </RoomSidebarSection>
  </RoomSidebarOuter>
);

export default RoomTextbookSidebarArchived;
