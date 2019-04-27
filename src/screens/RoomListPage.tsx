import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import DefaultLayout from '../complexes/DefaultLayout';
import Emoji from '../independents/Emoji';
import { noop } from '../misc';
import * as ErrorLogs from '../models/ErrorLogs';
import * as Rooms from '../models/Rooms';
import { AppDispatch, AppState } from '../models/Store';
import path, { RoomLink } from '../path';

function RoomItem ({ room }: { room: Rooms.IRoom }) {
  const { status, name } = room;

  const icon = status === Rooms.RoomStatus.draft
    ? <Emoji title="Draft" label="Lock" />
    : status === Rooms.RoomStatus.public
      ? <Emoji title="Public" label="White Heavy Check Mark" />
      : <Emoji title="Active" label="Fire" />;

  return (
    <tr>
      <td>{icon}</td>
      <td>
        <RoomLink room={room} type="settings">
          <Emoji label="Speech Balloon" />
          {' '}
          {name}
        </RoomLink>
      </td>
      <td>
        <RoomLink room={room}>
          <Emoji label="Open Book" />
          {' View'}
        </RoomLink>
      </td>
      <td>
        <RoomLink room={room} type="write">
          <Emoji label="Memo" />
          {' Write'}
        </RoomLink>
      </td>
      <td>{String(room.updatedAt && room.updatedAt.toDate())}</td>
    </tr>
  );
}

interface IRoomListPageProps {
  connectUserRooms: (userId: string) => () => void;
  userId: string;
  userRooms: Rooms.IRoom[];
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
        <p>
          <Emoji label="Lock" />
          {' Draft / '}
          <Emoji label="White Heavy Check Mark" />
          {' Public room / '}
          <Emoji label="Fire" />
          {' Active room'}
        </p>
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
  (state: AppState) => ({
    userId: state.currentUser.id,
    userRooms: Rooms.pickUserRooms(state),
  }),
  (dispatch: AppDispatch) => ({
    connectUserRooms: (userId: string) => Rooms.connectUserRooms(
      userId,
      (rooms) => dispatch(Rooms.setUserRooms(rooms)),
      (error) => dispatch(ErrorLogs.add('connect user rooms', error)),
    ),
  }),
)(RoomListPage);
