import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import { noop } from '../misc';
import { emptyRoom, RoomStatus } from '../models/Rooms';
import ConnectedRoomListPage from './RoomListPage';

const RoomListPage = ConnectedRoomListPage.WrappedComponent;

describe('<RoomListPage>', () => {
  let wrapper: ShallowWrapper;
  let connectUserRooms: jest.Mock<() => void, [string]>;
  let disconnectUserRooms: jest.Mock<void, []>;

  beforeEach(() => {
    disconnectUserRooms = jest.fn(noop);
    connectUserRooms = jest.fn((_: string) => disconnectUserRooms);
  });

  describe('without any rooms', () => {
    it('just show a message', () => {
      wrapper = shallow((
        <RoomListPage
          connectUserRooms={connectUserRooms}
          userId={''}
          userRooms={[]}
        />
      ));
      expect(wrapper.text()).toMatch('No rooms found.');
    });
  });

  describe('with rooms', () => {
    beforeEach(() => {
      wrapper = shallow((
        <RoomListPage
          connectUserRooms={connectUserRooms}
          userId={''}
          userRooms={[
            {
              ...emptyRoom,
              name: 'Draft room',
              status: RoomStatus.draft,
            },
            {
              ...emptyRoom,
              name: 'Public room',
              status: RoomStatus.public,
            },
            {
              ...emptyRoom,
              name: 'Active room',
              status: RoomStatus.active,
            },
          ]}
        />
      ));
    });

    it('renders each row', () => {
      expect(wrapper.find('RoomItem')).toHaveLength(3);
    });

    it('matches to snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('rooms connestion', () => {
    beforeEach(() => {
      wrapper = shallow((
        <RoomListPage
          connectUserRooms={connectUserRooms}
          userId={''}
          userRooms={[]}
        />
      ));
    });

    it('connects to user rooms', () => {
      expect(connectUserRooms).toBeCalled();
    });

    it('disconnects when unmount', () => {
      wrapper.unmount();
      expect(disconnectUserRooms).toBeCalled();
    });
  });
});
