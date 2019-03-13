import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import App from './App';

jest.mock('./models/users');
jest.mock('./models/rooms');

describe('<App>', () => {
  let wrapper: ShallowWrapper;

  describe('mount', () => {
    let unsubscribeCurrentUser: jest.Mock;
    let unsubscribeUserRooms: jest.Mock;

    beforeEach(() => {
      const users = require('./models/users');
      unsubscribeCurrentUser = jest.fn();
      users.initializeCurrentUser.mockReturnValue(unsubscribeCurrentUser);

      const rooms = require('./models/rooms');
      unsubscribeUserRooms = jest.fn();
      rooms.connectUserRooms.mockReturnValue(unsubscribeUserRooms);

      wrapper = shallow(<App />);
    });

    describe('current user', () => {
      it('connects', async () => {
        const users = require('./models/users');
        expect(users.initializeCurrentUser).toBeCalled();
      });

      it('disconnects', async () => {
        wrapper.unmount();
        expect(unsubscribeCurrentUser).toBeCalled();
      });
    });

    describe('user rooms', () => {
      it('connects', async () => {
        const rooms = require('./models/rooms');
        expect(rooms.connectUserRooms).toBeCalled();
      });

      it('disconnects', async () => {
        wrapper.unmount();
        expect(unsubscribeUserRooms).toBeCalled();
      });
    });
  });
});
