import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import App from './App';
import * as CurrentUser from './models/CurrentUser';
import * as Profiles from './models/Profiles';

describe('<App>', () => {
  let wrapper: ShallowWrapper;

  describe('mount', () => {
    let connectAuth: jest.SpyInstance;
    let unsubscribeAuth: jest.Mock;

    beforeEach(() => {
      connectAuth = jest.spyOn(CurrentUser, 'connectAuth');
      unsubscribeAuth = jest.fn();
    });

    afterEach(() => {
      connectAuth.mockRestore();
    });

    describe('current user', () => {
      beforeEach(() => {
        connectAuth.mockReturnValue(unsubscribeAuth);

        wrapper = shallow(<App />);
      });

      it('connects', async () => {
        expect(connectAuth).toBeCalled();
      });

      it('disconnects', async () => {
        wrapper.unmount();
        expect(unsubscribeAuth).toBeCalled();
      });
    });

    describe('profile', () => {
      let connectProfile: jest.SpyInstance;
      let unsubscribeProfiles: jest.Mock;

      describe('while logged in', () => {
        beforeEach(() => {
          connectAuth.mockImplementation((onNext: (user: any) => void) => {
            const user = {};
            onNext(user);
            return unsubscribeAuth;
          });

          connectProfile = jest.spyOn(Profiles, 'connectProfile');
          unsubscribeProfiles = jest.fn();
          connectProfile.mockReturnValue(unsubscribeProfiles);

          wrapper = shallow(<App />);
        });

        afterEach(() => {
          connectProfile.mockRestore();
        });

        it('connects', async () => {
          expect(connectProfile).toBeCalled();
        });

        it('disconnects', async () => {
          wrapper.unmount();
          expect(unsubscribeProfiles).toBeCalled();
        });
      });

      describe('while logged out', () => {
        beforeEach(() => {
          connectAuth.mockImplementation((onNext: (user: any) => void) => {
            const user = null;
            onNext(user);
            return unsubscribeAuth;
          });

          connectProfile = jest.spyOn(Profiles, 'connectProfile');
          unsubscribeProfiles = jest.fn();
          connectProfile.mockReturnValue(unsubscribeProfiles);

          wrapper = shallow(<App />);
        });

        afterEach(() => {
          connectProfile.mockRestore();
        });

        it('connects', async () => {
          expect(connectProfile).not.toBeCalled();
        });

        it('disconnects', async () => {
          expect(() => {
            wrapper.unmount();
          }).not.toThrow();
        });
      });
    });
  });
});
