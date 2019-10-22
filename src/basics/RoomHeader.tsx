import React from 'react';
import * as Profiles from '../models/Profiles';
import * as Rooms from '../models/Rooms';
import path from '../path';
import Header from './Header';
import { HeaderMenuGroup } from './HeaderMenu';

function getLoggedInMenu (profile: Profiles.Profile, room: Rooms.Room): HeaderMenuGroup[] {
  const menu: HeaderMenuGroup[] = [
    {
      links: [
        { title: 'Home', href: path('home') },
      ],
      name: 'CCC',
    },
    {
      links: [
        { title: 'Room list', href: path('room-list') },
        { title: 'Create new room', href: path('room-new') },
        { title: 'Settings', href: path('settings') },
        { title: 'Log out', href: path('logout') },
      ],
      name: profile.name,
    },
  ];

  if (profile.id === room.userId) {
    menu.unshift({
      links: [
        { title: 'Top', href: path('room', { id: room.id }) },
        { title: 'Write', href: path('room-write', { id: room.id }) },
        { title: 'Settings', href: path('room-settings', { id: room.id }) },
      ],
      name: 'Room',
    });
  }

  return menu;
}

function getAnonymousMenu (): HeaderMenuGroup[] {
  return [
    {
      links: [
        { title: 'Home', href: path('home') },
        { title: 'Log in', href: path('login') },
      ],
      name: 'CCC',
    },
  ];
}

interface Props {
  fullscreen?: boolean;
  room: Rooms.Room;
  userProfile: Profiles.Profile | null;
}

export default function RoomHeader (props: Props) {
  const { userProfile, room } = props;
  const menus = userProfile
    ? getLoggedInMenu(userProfile, room)
    : getAnonymousMenu();

  return (
    <div>
      <Header
        fullscreen={props.fullscreen}
        menus={menus}
        title={room.name}
        titleHref={path('room', { id: room.id })}
      />
    </div>
  );
}
