import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import { Room } from '../models/Rooms';
import RoomTextbookSidebar from './RoomTextbookSidebar';

describe('<RoomTextbookSidebar>', () => {
  let wrapper: ShallowWrapper;

  beforeEach(() => {
    const room = {} as Room;
    wrapper = shallow((
      <RoomTextbookSidebar room={room} />
    ));
  });

  it('renders successfully', () => {
    expect(wrapper).toHaveLength(1);
  });
});
