import { shallow } from 'enzyme';
import React from 'react';
import PrivacyPage from './PrivacyPage';

describe('<PrivacyPage>', () => {
  describe('mount', () => {
    it('is mounted', () => {
      expect(() => {
        shallow(<PrivacyPage />);
      }).not.toThrow();
    });
  });
});
