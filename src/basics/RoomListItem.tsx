import React from 'react';
import Emoji from '../independents/Emoji';
import { getReadableElapse } from '../misc';
import * as Rooms from '../models/Rooms';
import { RoomLink } from '../path';

interface Prop extends React.ComponentPropsWithRef<'tr'> {
  room: Rooms.Room;
}

export default function RoomListItem (props: Prop) {
  const { room, ...restProps } = props;
  const { status, name } = room;

  const icon = status === Rooms.RoomStatus.draft
    ? <Emoji title="Draft" label="Lock" />
    : status === Rooms.RoomStatus.public
      ? <Emoji title="Public" label="White Heavy Check Mark" />
      : <Emoji title="Active" label="Fire" />;

  return (
    <tr {...restProps}>
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
      <td>{getReadableElapse(room.updatedAt.toMillis())}</td>
    </tr>
  );
}
