import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import { Room } from '../models/Rooms';
import TextbookTasksSection from './TextbookTasksSection';

describe('<TextbookTasksSection>', () => {
  let wrapper: ShallowWrapper;

  beforeEach(() => {
    const room = {} as Room;
    wrapper = shallow((
      <TextbookTasksSection room={room} />
    ));
  });

  it('renders successfully', () => {
    expect(wrapper).toHaveLength(1);
  });
});
