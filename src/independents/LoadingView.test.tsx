import { shallow } from 'enzyme';
import React from 'react';
import LoadingView from './LoadingView';

describe('<LoadingView>', () => {
  it('can be rendered', () => {
    const wrapper = shallow(<LoadingView/>);
    expect(wrapper.text()).toBe('🐈');
  });
});
