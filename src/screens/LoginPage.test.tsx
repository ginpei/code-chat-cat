import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import firebase from '../middleware/firebase';
import ConnectedLoginPage from './LoginPage';

const LoginPage = ConnectedLoginPage.WrappedComponent;

describe('<LoginPage>', () => {
  describe('while logged in', () => {
    it('just show a message', () => {
      const wrapper = shallow((
        <LoginPage
          loggedIn={true}
        />
      ));
      expect(wrapper.text()).toMatch('Logged in');
    });
  });

  describe('while logged out', () => {
    let wrapper: ShallowWrapper;
    let auth: jest.SpyInstance;

    beforeEach(() => {
      auth = jest.spyOn(firebase, 'auth')
        .mockReturnValue({} as any);
      Object.assign(auth, {
        EmailAuthProvider: {
          PROVIDER_ID: 'EmailAuthProvider',
        },
        GithubAuthProvider: {
          PROVIDER_ID: 'GithubAuthProvider',
        },
      });

      wrapper = shallow((
        <LoginPage
          loggedIn={false}
        />
      ));
    });

    afterEach(() => {
      auth.mockRestore();
    });

    it('show the login form', () => {
      expect(wrapper.text()).toMatch('Login');

      // how to find the component StyledFirebaseAuth?
      // expect(wrapper.find('StyledFirebaseAuth')).toHaveLength(1);
      // expect(wrapper.find('#firebaseui_container')).toHaveLength(1);
    });

    it('matches snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
