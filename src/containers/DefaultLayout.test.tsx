import { mount, ReactWrapper } from 'enzyme';
import firebase from 'firebase';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { IUserProfile } from '../reducers/currentUser';
import { DefaultLayout } from './DefaultLayout';

describe('<Header>', () => {
  let wrapper: ReactWrapper;

  describe('basic', () => {
    beforeEach(() => {
      wrapper = mount((
        <BrowserRouter>
          <DefaultLayout userProfile={null}>
            Hello World!
          </DefaultLayout>
        </BrowserRouter>
      ));
    });

    it('renders default header', () => {
      expect(wrapper.find(Header).text()).toMatch('Code Chat Cat');
    });

    it('renders given content', () => {
      expect(wrapper.text()).toMatch('Hello World!');
    });

    it('renders footer', () => {
      expect(wrapper.find(Footer).text()).toMatch('By Ginpei Takanashi');
    });
  });

  describe('logged in user', () => {
    beforeEach(() => {
      const profile: IUserProfile = {
        createdAt: firebase.firestore.Timestamp.now(),
        id: 'user-id-123',
        name: 'user-name',
        updatedAt: firebase.firestore.Timestamp.now(),
      };
      wrapper = mount((
        <BrowserRouter>
          <DefaultLayout userProfile={profile}>
            Hello World!
          </DefaultLayout>
        </BrowserRouter>
      ));
    });

    it('renders header for logged-in users', () => {
      expect(wrapper.find(Header).text()).toMatch('Log out');
    });
  });

  describe('logged in user', () => {
    beforeEach(() => {
      wrapper = mount((
        <BrowserRouter>
          <DefaultLayout userProfile={null}>
            Hello World!
          </DefaultLayout>
        </BrowserRouter>
      ));
    });

    it('renders header for logged-in users', () => {
      expect(wrapper.find(Header).text()).toMatch('Log in');
    });
  });
});