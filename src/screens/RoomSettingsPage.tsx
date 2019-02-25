import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import DefaultLayout from '../components/DefaultLayout';
import LoadingView from '../components/LoadingView';
import { appHistory } from '../misc';
import { deleteRoom } from '../models/rooms';
import { Dispatch, IState } from '../reducers';
import { IRoom, RoomsActionTypes } from '../reducers/rooms';
import NotFoundPage from './NotFoundPage';

const DangerZone = styled.div`
  border: solid 1px tomato;
  padding: 1rem;
`;

interface IRoomSettingsPageParams {
  id: string;
}
interface IRoomSettingsPageProps
  extends RouteComponentProps<IRoomSettingsPageParams> {
  firebaseUser: firebase.User | null;
  loggedIn: boolean;
  saveRoom: (room: IRoom) => void;
  userRooms: IRoom[];
}
interface IRoomSettingsPageState {
  errorMessage: string;
  ready: boolean;
  roomActive: boolean;
  roomName: string;
  roomSaving: boolean;
}

class RoomSettingsPage extends React.Component<IRoomSettingsPageProps, IRoomSettingsPageState> {
  protected get roomId () {
    return this.props.match.params.id;
  }

  protected get room () {
    return this.props.userRooms.find((v) => v.id === this.roomId) || null;
  }

  constructor (props: IRoomSettingsPageProps) {
    super(props);
    const { room } = this;
    this.state = {
      errorMessage: '',
      ready: false,
      roomActive: room ? room.active : false,
      roomName: room ? room.name : '',
      roomSaving: false,
    };
    this.onRoomNameChange = this.onRoomNameChange.bind(this);
    this.onRoomActiveChange = this.onRoomActiveChange.bind(this);
    this.onRoomSubmit = this.onRoomSubmit.bind(this);
    this.onRoomDeleteClick = this.onRoomDeleteClick.bind(this);
  }

  public render () {
    const room = this.room;

    if (!room) {
      return (
        <NotFoundPage/>
      );
    }

    return (
      <DefaultLayout>
        <h1>Room settings</h1>
        <p>
          <Link to={`/rooms/${room.id}`}>Textbook</Link>
          {' | '}
          <Link to={`/rooms/${room.id}/write`}>Write</Link>
        </p>
        <form
          onSubmit={this.onRoomSubmit}
        >
          <table>
            <tbody>
              <tr>
                <th>ID</th>
                <td>{room.id}</td>
              </tr>
              <tr>
                <th>Name</th>
                <td>
                  <input
                    disabled={this.state.roomSaving}
                    onChange={this.onRoomNameChange}
                    type="text"
                    value={this.state.roomName}
                  />
                </td>
              </tr>
              <tr>
                <th>Active</th>
                <td>
                  <input
                    disabled={this.state.roomSaving}
                    onChange={this.onRoomActiveChange}
                    type="checkbox"
                    checked={this.state.roomActive}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <p>
            <button
              disabled={this.state.roomSaving}
            >
              Save
            </button>
          </p>
        </form>
        <h2>Danger zone</h2>
        <DangerZone>
          <button
            onClick={this.onRoomDeleteClick}
          >
            Delete
          </button>
        </DangerZone>
      </DefaultLayout>
    );
  }

  public onRoomNameChange (event: React.ChangeEvent<HTMLInputElement>) {
    const el = event.currentTarget;
    const roomName = el.value;
    this.setState({ roomName });
  }

  public onRoomActiveChange (event: React.ChangeEvent<HTMLInputElement>) {
    const el = event.currentTarget;
    const roomActive = el.checked;
    this.setState({ roomActive });
  }

  public async onRoomSubmit (event: React.MouseEvent<HTMLFormElement>) {
    event.preventDefault();

    const room: IRoom = {
      ...this.room!,
      active: this.state.roomActive,
      name: this.state.roomName,
    };
    this.props.saveRoom(room);
  }

  public async onRoomDeleteClick (event: React.MouseEvent<HTMLButtonElement>) {
    const ok = confirm('Are you sure you want to delete this room?');
    if (!ok) {
      return;
    }

    this.setState({
      ready: false,
    });
    await deleteRoom(this.room!);
    appHistory.push('/rooms');
  }
}

const mapStateToProps = (state: IState) => ({
  firebaseUser: state.currentUser.firebaseUser,
  loggedIn: state.currentUser.loggedIn,
  userRooms: state.rooms.userRooms,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  saveRoom: (room: IRoom) => dispatch({ room, type: RoomsActionTypes.saveRoom }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RoomSettingsPage);
