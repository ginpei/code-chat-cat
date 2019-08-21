import React from 'react';
import { Link } from 'react-router-dom';
import * as Rooms from './models/Rooms';

type SimplePathBase =
  | 'home'
  | 'settings'
  | 'login'
  | 'logout'
  | 'room-list'
  | 'room-new';
function path (base: SimplePathBase): string;
function path (
  base: 'room' | 'room-write' | 'room-settings',
  params: { id: string },
): string;
function path (base: string, params?: any): string {
  switch (base) {
    case 'home': return '/';
    case 'login': return '/login';
    case 'logout': return '/logout';
    case 'room-list': return '/rooms';
    case 'room-new': return '/rooms/new';
    case 'room-settings': return `${path('room', params)}/settings`;
    case 'room-write': return `${path('room', params)}/write`;
    case 'room': return `/rooms/${params.id}`;
    case 'settings': return '/settings';
    default: throw new Error(`Unknown path: ${base}`);
  }
}
export default path;

export function HomeLink () {
  return <Link to={path('home')}>Home</Link>;
}

export function RoomLink (props: React.PropsWithChildren<{
  room: Rooms.Room;
  type?: 'settings' | 'write';
}>) {
  const base =
    props.type === 'write'
      ? 'room-write'
      : props.type === 'settings'
        ? 'room-settings'
        : 'room';
  const { id } = props.room;
  const children = props.children || props.room.name;
  return <Link to={path(base, { id })}>{children}</Link>;
}
