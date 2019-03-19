import { shallow } from 'enzyme';
import React from 'react';
import Container from './Container';

describe('<Container>', () => {
  it('accepts children', () => {
    const wrapper = shallow(<Container>Hello!</Container>);
    expect(wrapper.childAt(0).text()).toBe('Hello!');
  });
});
