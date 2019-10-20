import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import { Room } from '../models/Rooms';
import RoomIndexList from './RoomIndexList';

describe('<RoomIndexList>', () => {
  let wrapper: ShallowWrapper;

  beforeEach(() => {
    const room = {
      textbookContent: `
# Heading 1
## H e a d i n g 2
### Hi \`~!@#$%^&*()_+[]{}|;':",./<>? Hey Ho Symbols!
        `.trim(),
    } as Room;
    wrapper = shallow((
      <RoomIndexList room={room} />
    ));
  });

  it('renders headings except for the level 1', () => {
    expect(wrapper.find('li')).toHaveLength(2);
  });

  it('prints heading content', () => {
    expect(wrapper.find('li').at(0).text()).toBe('H e a d i n g 2');
  });

  it('links to headings replacing spaces with hyphens', () => {
    expect(wrapper.find('a').at(0).prop('href')).toBe('#h-e-a-d-i-n-g-2');
  });

  it('sanitizes symbols', () => {
    expect(wrapper.find('a').at(1).prop('href')).toBe(
      '#hi-%60~!%40%23%24%25%5E%26*()_%2B%5B%5D%7B%7D%7C%3B\'%3A%22%2C.%2F%3C%3E%3F-hey-ho-symbols!',
    );
  });
});
