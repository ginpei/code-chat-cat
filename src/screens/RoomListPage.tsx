import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import DefaultLayout from '../components/DefaultLayout';
import LoadingView from '../components/LoadingView';
import { connectUserRooms } from '../models/rooms';
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
    </tr>
  );
}

interface IRoomListPageProps {
  userId: string;
}
interface IRoomListPageState {
  ready: boolean;
  rooms: IRoom[];
}

class RoomListPage extends React.Component<IRoomListPageProps, IRoomListPageState> {
  protected unsubscribeRooms: (() => void) | null = null;

  constructor (props: IRoomListPageProps) {
    super(props);
    this.state = {
      ready: false,
      rooms: [],
    };
  }

  public render () {
    if (!this.state.ready) {
      return (
        <LoadingView/>
      );
    }

    const rooms = this.state.rooms;

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

  public componentDidMount () {
    const userId = this.props.userId;
    this.unsubscribeRooms = connectUserRooms(userId, (rooms) => {
      this.setState({ rooms });

      if (!this.state.ready) {
        this.setState({
          ready: true,
        });
      }
    });
  }

  public componentWillUnmount () {
    if (this.unsubscribeRooms) {
      this.unsubscribeRooms();
    }
  }
}

const mapStateToProps = (state: IState) => ({
  userId: state.currentUser.uid,
});

export default connect(mapStateToProps)(RoomListPage);
