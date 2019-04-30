import * as Rooms from './Rooms';

jest.mock('firebase');

describe('Rooms', () => {
  let state: Rooms.IRoomState;
  let result: Rooms.IRoomState;

  afterEach(() => {
    state = {
      activeRoomIds: [],
      docs: {},
      userRoomIds: [],
    };
    result = {
      activeRoomIds: [],
      docs: {},
      userRoomIds: [],
    };
  });

  describe('reduceRooms', () => {
    describe('setUserRooms', () => {
      beforeEach(() => {
        const action = Rooms.setUserRooms([
          {
            ...Rooms.emptyRoom,
            id: 'room-1',
          },
          {
            ...Rooms.emptyRoom,
            id: 'room-2',
          },
        ]);
        result = Rooms.reduceRooms(state, action);
      });

      it('hosts IDs', () => {
        expect(result.userRoomIds).toEqual([
          'room-1',
          'room-2',
        ]);
      });

      it('hosts rooms', () => {
        expect(Object.keys(result.docs)).toEqual([
          'room-1',
          'room-2',
        ]);
      });
    });
  });
});
