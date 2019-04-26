import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import { noop } from '../misc';
import * as CurrentUser from '../models/CurrentUser';
import LogoutPage from './LogoutPage';

jest.mock('../models/CurrentUser');

describe('<LogoutPage>', () => {
  let wrapper: ShallowWrapper;
  let logOut: jest.SpyInstance;

  describe('while logged in', () => {
    beforeEach(() => {
      logOut = jest.spyOn(CurrentUser, 'logOut')
        .mockReturnValue(new Promise<void>(noop));

      wrapper = shallow((
        <LogoutPage />
      ));
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('shows a message', () => {
      expect(wrapper.text()).toMatch('Logging out...');
    });

    it('starts logging out', () => {
      expect(logOut).toBeCalled();
    });
  });

  // how to update useState?
  // describe('while logged out', () => {
  //   beforeEach(() => {
  //     logOut = jest.spyOn(CurrentUser, 'logOut')
  //       .mockResolvedValue();

  //     wrapper = shallow((
  //       <LogoutPage />
  //     ));
  //   });

  //   afterEach(() => {
  //     jest.restoreAllMocks();
  //   });

  //   it('shows a message', () => {
  //     expect(wrapper.text()).toMatch('Logged out');
  //   });

  //   it('does not start logging out any more', () => {
  //     expect(logOut).not.toBeCalled();
  //   });
  // });
});
