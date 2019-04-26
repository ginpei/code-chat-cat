import { shallow } from 'enzyme';
import React from 'react';
import NotFoundPage from './NotFoundPage';

describe('<NotFoundPage>', () => {
  describe('mount', () => {
    it('is mounted', () => {
      expect(() => {
        shallow(<NotFoundPage />);
      }).not.toThrow();
    });
  });
});
