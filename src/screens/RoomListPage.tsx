import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import DefaultLayout from '../components/DefaultLayout';
import { IState } from '../reducers';
import { IRoom } from '../reducers/rooms';

function RoomItem ({ room }: { room: IRoom }) {
  const { active, name } = room;
  return (
    <tr>
      <td>
        {active && <span title="Active">✅</span>}
      </td>
      <td><Link to={`/rooms/${room.id}/settings`}>💬 {name}</Link></td>
      <td><Link to={`/rooms/${room.id}/`}>📖 View</Link></td>
      <td><Link to={`/rooms/${room.id}/write`}>📝 Write</Link></td>
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
          <Link to="/rooms/new">Create new room</Link>
        </p>
        <p>✅ Active room</p>
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

const mapStateToProps = (state: IState) => ({
  userId: state.currentUser.uid,
  userRooms: state.rooms.userRooms,
});

export default connect(mapStateToProps)(RoomListPage);
