import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import { emptyRoom, Room, RoomStatus } from '../models/Rooms';
import RoomListItem from './RoomListItem';

describe('<RoomListItem>', () => {
  let wrapper: ShallowWrapper;
  let room: Room;

  beforeEach(() => {
    room = { ...emptyRoom };
  });

  it('renders draft room', () => {
    room.status = RoomStatus.draft;
    wrapper = shallow((
      <RoomListItem
        room={room}
      />
    ));

    const elEmoji = wrapper.find('td').at(0).find('Emoji');
    expect(elEmoji.prop('label')).toMatch('Lock');
  });

  it('renders public room', () => {
    room.status = RoomStatus.public;
    wrapper = shallow((
      <RoomListItem
        room={room}
      />
    ));

    const elEmoji = wrapper.find('td').at(0).find('Emoji');
    expect(elEmoji.prop('label')).toMatch('White Heavy Check Mark');
  });

  it('renders active room', () => {
    room.status = RoomStatus.active;
    wrapper = shallow((
      <RoomListItem
        room={room}
      />
    ));

    const elEmoji = wrapper.find('td').at(0).find('Emoji');
    expect(elEmoji.prop('label')).toMatch('Fire');
  });
});
