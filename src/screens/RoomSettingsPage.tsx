import React, { useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import Footer from '../basics/Footer';
import RoomHeader from '../basics/RoomHeader';
import { MainContainer } from '../complexes/DefaultLayout';
import LoadingView from '../independents/LoadingView';
import { appHistory, noop, setTitle } from '../misc';
import * as ErrorLogs from '../models/ErrorLogs';
import * as Profiles from '../models/Profiles';
import * as Rooms from '../models/Rooms';
import { AppDispatch, AppState } from '../models/Store';
import { RoomLink } from '../path';
import NotFoundPage from './NotFoundPage';

const RoomStatusInputLabel = styled.label`
  margin-right: 1em;
`;

interface RoomStatusInputProps {
  disabled: boolean;
  name: string;
  onChange: (roomStatus: Rooms.RoomStatus) => void;
  type: Rooms.RoomStatus;
  value: Rooms.RoomStatus;
}
function RoomStatusInput (props: RoomStatusInputProps) {
  const sLabel = props.type === Rooms.RoomStatus.draft
    ? 'Draft'
    : props.type === Rooms.RoomStatus.public
      ? 'Public'
      : 'Active';

  const onChange = () => props.onChange(props.type);

  return (
    <RoomStatusInputLabel>
      <input
        checked={props.value === props.type}
        disabled={props.disabled}
        name={props.name}
        onChange={onChange}
        type="radio"
      />
      {sLabel}
    </RoomStatusInputLabel>
  );
}

interface RoomStatusInputGroupProps {
  disabled: boolean;
  onChange: (roomStatus: Rooms.RoomStatus) => void;
  value: Rooms.RoomStatus;
}
function RoomStatusInputGroup (props: RoomStatusInputGroupProps) {
  const randomKey = String(Math.floor(Math.random() * 1000));
  const initialName = `RoomStatusInputGroup-${Date.now()}-${randomKey}`;
  const [name] = useState(initialName);
  const types = [
    Rooms.RoomStatus.draft,
    Rooms.RoomStatus.public,
    Rooms.RoomStatus.active,
  ];
  return (
    <>
      {types.map((type) => (
        <RoomStatusInput
          disabled={props.disabled}
          key={type}
          name={name}
          onChange={props.onChange}
          type={type}
          value={props.value}
        />
      ))}
    </>
  );
}

const DangerZone = styled.div`
  border: solid 1px tomato;
  padding: 1rem;
`;

interface PageParams {
  id: string;
}
interface Props
  extends RouteComponentProps<PageParams> {
  pickRoom: (roomId: string) => Rooms.Room;
  removeRoom: (room: Rooms.Room) => Promise<void>;
  saveError: (location: string, error: ErrorLogs.AppError) => void;
  saveRoom: (room: Rooms.Room) => void;
  storeRoom: (room: Rooms.Room) => void;
  userProfile: Profiles.Profile | null;
  userRooms: Rooms.Room[];
}
interface State {
  initialized: boolean;
  room: Rooms.Room | null;
  roomName: string;
  roomSaving: boolean;
  roomStatus: Rooms.RoomStatus;
}

class RoomSettingsPage extends React.Component<Props, State> {
  protected unsubscribeRoom = noop;

  protected get roomId () {
    return this.props.match.params.id;
  }

  public constructor (props: Props) {
    super(props);
    const room = props.pickRoom(this.roomId);
    this.state = {
      initialized: false,
      room,
      roomName: room ? room.name : '',
      roomSaving: false,
      roomStatus: room ? room.status : Rooms.RoomStatus.draft,
    };
    this.onRoomNameChange = this.onRoomNameChange.bind(this);
    this.onRoomActiveChange = this.onRoomActiveChange.bind(this);
    this.onRoomSubmit = this.onRoomSubmit.bind(this);
    this.onRoomDeleteClick = this.onRoomDeleteClick.bind(this);
  }

  public render () {
    const { initialized, room } = this.state;

    if (!initialized) {
      return (
        <LoadingView/>
      );
    }

    if (!room) {
      return (
        <NotFoundPage/>
      );
    }

    if (!room.id) {
      return (
        <LoadingView/>
      );
    }

    return (
      <div>
        <RoomHeader
          room={room}
          userProfile={this.props.userProfile}
        />
        <MainContainer>
          <h1>Room settings</h1>
          <p>
            <RoomLink room={room}>Textbook</RoomLink>
            {' | '}
            <RoomLink room={room} type="write">Write</RoomLink>
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
                  <th>Status</th>
                  <td>
                    <RoomStatusInputGroup
                      disabled={this.state.roomSaving}
                      onChange={this.onRoomActiveChange}
                      value={this.state.roomStatus}
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
        </MainContainer>
        <Footer/>
      </div>
    );
  }

  public componentDidMount () {
    this.updateTitle();

    this.unsubscribeRoom = Rooms.connectRoom(
      this.roomId,
      (room) => this.setRoom(room),
      (error) => {
        this.setRoom(null);
        this.props.saveError('connect room', error);
      },
      () => this.setState({ initialized: true }),
    );
  }

  public componentWillUnmount () {
    this.unsubscribeRoom();
  }

  public onRoomNameChange (event: React.ChangeEvent<HTMLInputElement>) {
    const el = event.currentTarget;
    const roomName = el.value;
    this.setState({ roomName });
  }

  public onRoomActiveChange (roomStatus: Rooms.RoomStatus) {
    this.setState({ roomStatus });
  }

  public onRoomSubmit (event: React.MouseEvent<HTMLFormElement>) {
    event.preventDefault();

    this.setState({
      roomSaving: true,
    });

    const room: Rooms.Room = {
      ...this.state.room!,
      name: this.state.roomName,
      status: this.state.roomStatus,
    };
    this.props.saveRoom(room);

    setTimeout(() => {
      this.setState({
        roomSaving: false,
      });
    }, 500);
  }

  public onRoomDeleteClick (event: React.MouseEvent<HTMLButtonElement>) {
    const ok = window.confirm('Are you sure you want to delete this room?');
    if (!ok) {
      return;
    }

    this.setState({
      roomSaving: true,
    });
    this.props.removeRoom(this.state.room!);
    appHistory.push('/rooms');
  }

  protected updateTitle () {
    const { room } = this.state;
    setTitle('Settings', room ? room.name : '...');
  }

  protected setRoom (room: Rooms.Room | null) {
    this.setState({
      room,
      roomName: room ? room.name : '',
      roomStatus: room ? room.status : Rooms.RoomStatus.draft,
    }, () => this.updateTitle());

    if (room) {
      this.props.storeRoom(room);
    }
  }
}

export default connect(
  (state: AppState) => ({
    pickRoom: (roomId: string) => Rooms.pickRoom(state, roomId),
    userProfile: state.currentUser.profile,
    userRooms: Rooms.pickUserRooms(state),
  }),
  (dispatch: AppDispatch) => ({
    removeRoom: (room: Rooms.Room) => dispatch(Rooms.removeRoom(room)),
    saveError: (location: string, error: ErrorLogs.AppError) => dispatch(
      ErrorLogs.add(location, error),
    ),
    saveRoom: (room: Rooms.Room) => dispatch(Rooms.saveRoom(room)),
    storeRoom: (room: Rooms.Room) => dispatch(Rooms.storeRoom(room)),
  }),
)(RoomSettingsPage);
