import { shallow } from 'enzyme';
import React from 'react';
import TermsPage from './TermsPage';

describe('<TermsPage>', () => {
  describe('mount', () => {
    it('is mounted', () => {
      expect(() => {
        shallow(<TermsPage />);
      }).not.toThrow();
    });
  });
});
