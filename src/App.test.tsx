import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import App from './App';

describe('<App>', () => {
  let wrapper: ShallowWrapper;

  beforeEach(() => {
    wrapper = shallow(
      <App />,
    );
  });

  it('renders', () => {
    expect(wrapper).toHaveLength(1);
  });
});
