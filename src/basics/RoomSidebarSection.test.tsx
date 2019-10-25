import { mount, ReactWrapper } from 'enzyme';
import React from 'react';
import RoomSidebarSection from './RoomSidebarSection';

describe('<RoomSidebarSection>', () => {
  let wrapper: ReactWrapper;

  beforeEach(() => {
    wrapper = mount((
      <RoomSidebarSection heading="Heading">
        <p>Child content</p>
      </RoomSidebarSection>
    ));
  });

  it('prints heading', () => {
    expect(wrapper.find('summary').text()).toBe('Heading');
  });

  it('renders content', () => {
    expect(wrapper.find('p').text()).toBe('Child content');
  });
});
