import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import DefaultLayout from '../complexes/DefaultLayout';
import { noop } from '../misc';
import * as ErrorLogs from '../models/ErrorLogs';
import * as Rooms from '../models/Rooms';
import path, { RoomLink } from '../path';
import { Dispatch, IState } from '../reducers';
import { IRoom, RoomStatus } from '../reducers/rooms';

function RoomItem ({ room }: { room: IRoom }) {
  const { status, name } = room;
  return (
    <tr>
      <td>
        {status === RoomStatus.draft && <span title="Draft">🔒</span>}
        {status === RoomStatus.public && <span title="Public">✅</span>}
        {status === RoomStatus.active && <span title="Active">🔥</span>}
      </td>
      <td><RoomLink room={room} type="settings">💬 {name}</RoomLink></td>
      <td><RoomLink room={room}>📖 View</RoomLink></td>
      <td><RoomLink room={room} type="write">📝 Write</RoomLink></td>
      <td>{String(room.updatedAt && room.updatedAt.toDate())}</td>
    </tr>
  );
}

interface IRoomListPageProps {
  connectUserRooms: (userId: string) => () => void;
  userId: string;
  userRooms: IRoom[];
}

class RoomListPage extends React.Component<IRoomListPageProps> {
  protected unsubscribeUserRooms = noop;

  public render () {
    const rooms = this.props.userRooms;

    return (
      <DefaultLayout>
        <h1>Room list</h1>
        <p>
          <Link to={path('room-new')}>Create new room</Link>
        </p>
        <p>🔒 Draft / ✅ Public room / 🔥 Active room</p>
        {rooms.length < 1 ? (
          <p>No rooms found.</p>
        ) : (
          <table>
            <tbody>
              {rooms.map((room) => (
                <RoomItem
                  key={room.id}
                  room={room}
                />
              ))}
            </tbody>
          </table>
        )}
      </DefaultLayout>
    );
  }

  public componentDidMount () {
    this.unsubscribeUserRooms = this.props.connectUserRooms(this.props.userId);
  }

  public componentWillUnmount () {
    this.unsubscribeUserRooms();
  }
}

export default connect(
  (state: IState) => ({
    userId: state.currentUser.id,
    userRooms: Rooms.pickUserRooms(state),
  }),
  (dispatch: Dispatch) => ({
    connectUserRooms: (userId: string) => Rooms.connectUserRooms(
      userId,
      (rooms) => dispatch(Rooms.setUserRooms(rooms)),
      (error) => dispatch(ErrorLogs.add('connect user rooms', error)),
    ),
  }),
)(RoomListPage);
