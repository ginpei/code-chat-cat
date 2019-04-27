import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import RoomListItem from '../basics/RoomListItem';
import DefaultLayout from '../complexes/DefaultLayout';
import Emoji from '../independents/Emoji';
import { noop } from '../misc';
import * as ErrorLogs from '../models/ErrorLogs';
import * as Rooms from '../models/Rooms';
import { AppDispatch, AppState } from '../models/Store';
import path from '../path';

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
                <RoomListItem
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
