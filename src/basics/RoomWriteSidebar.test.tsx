import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import { Room } from '../models/Rooms';
import RoomWriteSidebar from './RoomWriteSidebar';

describe('<RoomWriteSidebar>', () => {
  let wrapper: ShallowWrapper;

  beforeEach(() => {
    const room = {} as Room;
    wrapper = shallow((
      <RoomWriteSidebar room={room} />
    ));
  });

  it('renders successfully', () => {
    expect(wrapper).toHaveLength(1);
  });
});
