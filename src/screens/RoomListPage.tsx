import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import DefaultLayout from '../containers/DefaultLayout';
import path, { RoomLink } from '../path';
import { IState } from '../reducers';
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
  userId: string;
  userRooms: IRoom[];
}

class RoomListPage extends React.Component<IRoomListPageProps> {
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
}

export default connect(
  (state: IState) => ({
    userId: state.currentUser.uid,
    userRooms: state.rooms.userRooms,
  }),
)(RoomListPage);
