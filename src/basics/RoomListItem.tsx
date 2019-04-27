import React from 'react';
import Emoji from '../independents/Emoji';
import * as Rooms from '../models/Rooms';
import { RoomLink } from '../path';

export default function RoomItem ({ room }: { room: Rooms.IRoom }) {
  const { status, name } = room;

  const icon = status === Rooms.RoomStatus.draft
    ? <Emoji title="Draft" label="Lock" />
    : status === Rooms.RoomStatus.public
      ? <Emoji title="Public" label="White Heavy Check Mark" />
      : <Emoji title="Active" label="Fire" />;

  return (
    <tr>
      <td>{icon}</td>
      <td>
        <RoomLink room={room} type="settings">
          <Emoji label="Speech Balloon" />
          {' '}
          {name}
        </RoomLink>
      </td>
      <td>
        <RoomLink room={room}>
          <Emoji label="Open Book" />
          {' View'}
        </RoomLink>
      </td>
      <td>
        <RoomLink room={room} type="write">
          <Emoji label="Memo" />
          {' Write'}
        </RoomLink>
      </td>
      <td>{String(room.updatedAt && room.updatedAt.toDate())}</td>
    </tr>
  );
}
