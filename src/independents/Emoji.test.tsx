import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import Emoji, { LockEmoji } from './Emoji';

describe('<Emoji>', () => {
  let wrapper: ShallowWrapper;

  describe('general component', () => {
    beforeEach(() => {
      wrapper = shallow((
        <Emoji
          label="Fire"
          title="Hey Yo"
        />
      ));
    });

    it('renders fire emoji', () => {
      expect(wrapper.text()).toMatch('🔥');
    });

    it('accepts basic span element props', () => {
      expect(wrapper.find('span').prop('title')).toBe('Hey Yo');
    });
  });

  describe('specific emoji', () => {
    it('renders lock emoji', () => {
      wrapper = shallow((
        <LockEmoji />
      ));

      expect(wrapper.find('Emoji').prop('label')).toMatch('Lock');
    });
  });
});
