import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import { Room } from '../models/Rooms';
import RoomTaskConsole from './RoomTaskConsole';

describe('<RoomTaskConsole>', () => {
  let wrapper: ShallowWrapper;

  beforeEach(() => {
    const room = {} as Room;
    wrapper = shallow((
      <RoomTaskConsole room={room} />
    ));
  });

  it('renders successfully', () => {
    expect(wrapper).toHaveLength(1);
  });
});
