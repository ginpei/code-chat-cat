import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import DefaultLayout from '../complexes/DefaultLayout';
import { noop } from '../misc';
import * as ErrorLogs from '../models/ErrorLogs';
import * as Rooms from '../models/Rooms';
import { AppDispatch, AppState } from '../models/Store';
import path, { RoomLink } from '../path';

function DraftIcon () {
  return <span role="img" aria-label="Lock" title="Draft">🔒</span>;
}

function PublicIcon () {
  return <span role="img" aria-label="White Heavy Check Mark" title="Public">✅</span>;
}

function ActiveIcon () {
  return <span role="img" aria-label="Fire" title="Active">🔥</span>;
}

function SpeechBalloonEmoji () {
  return <span role="img" aria-label="Speech Balloon">💬</span>;
}

function OpenBookEmoji () {
  return <span role="img" aria-label="Open Book">📖</span>;
}

function MemoEmoji () {
  return <span role="img" aria-label="Memo">📝</span>;
}

function RoomItem ({ room }: { room: Rooms.IRoom }) {
  const { status, name } = room;
  return (
    <tr>
      <td>
        {status === Rooms.RoomStatus.draft && <DraftIcon/>}
        {status === Rooms.RoomStatus.public && <PublicIcon/>}
        {status === Rooms.RoomStatus.active && <ActiveIcon/>}
      </td>
      <td>
        <RoomLink room={room} type="settings">
          <SpeechBalloonEmoji/>
          {' '}
          {name}
        </RoomLink>
      </td>
      <td>
        <RoomLink room={room}>
          <OpenBookEmoji/>
          {' View'}
        </RoomLink>
      </td>
      <td>
        <RoomLink room={room} type="write">
          <MemoEmoji/>
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
          <DraftIcon/>
          {' Draft / '}
          <PublicIcon/>
          {' Public room / '}
          <ActiveIcon/>
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
