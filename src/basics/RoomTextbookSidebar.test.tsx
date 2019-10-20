import { mount, ReactWrapper } from 'enzyme';
import React from 'react';
import { Room } from '../models/Rooms';
import RoomTextbookSidebar from './RoomTextbookSidebar';

describe('<RoomTextbookSidebar>', () => {
  let wrapper: ReactWrapper;

  describe('index', () => {
    beforeEach(() => {
      const room = {
        textbookContent: `
# Heading 1
## H e a d i n g 2
### Heading 3
        `.trim(),
      } as Room;
      wrapper = mount((
        <RoomTextbookSidebar room={room} />
      ));
    });

    it('renders headings except for the level 1', () => {
      expect(wrapper.find('li')).toHaveLength(2);
    });

    it('prints heading content', () => {
      expect(wrapper.find('li').at(0).text()).toBe('H e a d i n g 2');
    });

    it('links to headings replacing spaces with hyphens', () => {
      expect(wrapper.find('a').at(0).prop('href')).toBe('#H-e-a-d-i-n-g-2');
    });
  });
});
