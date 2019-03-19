import { shallow } from 'enzyme';
import React from 'react';
import Footer from './Footer';

describe('<Footer>', () => {
  it('can be rendered', () => {
    const wrapper = shallow(<Footer/>);
    expect(wrapper.text()).toBe('By Ginpei Takanashi');
  });
});
