import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import RoomTextbookSidebarArchived from './RoomTextbookSidebarArchived';
import { Room } from '../models/Rooms';
import RoomSidebarSection from './RoomSidebarSection';

describe('RoomTextbookSidebarArchived', () => {
  let wrapper: ShallowWrapper;
  let room: Room;

  beforeEach(() => {
    room = {
      textbookContent: `
## Heading 1
`,
    } as Room;

    wrapper = shallow((
      <RoomTextbookSidebarArchived room={room} />
    ));
  });

  it('inform archived', () => {
    expect(wrapper.text()).toContain('This room has been archived.');
  });

  it('prints index', () => {
    expect(wrapper.find(RoomSidebarSection)).toHaveLength(1);
    expect(wrapper.find(RoomSidebarSection).prop('heading')).toBe('Index');
  });
});
