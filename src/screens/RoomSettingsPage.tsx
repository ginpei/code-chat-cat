import React, { useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import Footer from '../basics/Footer';
import RoomHeader from '../basics/RoomHeader';
import { MainContainer } from '../complexes/DefaultLayout';
import { appHistory } from '../misc';
import { RoomLink } from '../path';
import { Dispatch, IState } from '../reducers';
import { IUserProfile } from '../reducers/currentUser';
import { IRoom, RoomsActionTypes, RoomStatus } from '../reducers/rooms';
import NotFoundPage from './NotFoundPage';

const RoomStatusInputLabel = styled.label`
  margin-right: 1em;
`;

interface IRoomStatusInputProps {
  disabled: boolean;
  name: string;
  onChange: (roomStatus: RoomStatus) => void;
  type: RoomStatus;
  value: RoomStatus;
}
function RoomStatusInput (props: IRoomStatusInputProps) {
  const sLabel = props.type === RoomStatus.draft
    ? 'Draft'
    : props.type === RoomStatus.public
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

interface IRoomStatusInputGroupProps {
  disabled: boolean;
  onChange: (roomStatus: RoomStatus) => void;
  value: RoomStatus;
}
function RoomStatusInputGroup (props: IRoomStatusInputGroupProps) {
  const randomKey = String(Math.floor(Math.random() * 1000));
  const initialName = `RoomStatusInputGroup-${Date.now()}-${randomKey}`;
  const [name] = useState(initialName);
  const types = [
    RoomStatus.draft,
    RoomStatus.public,
    RoomStatus.active,
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

interface IRoomSettingsPageParams {
  id: string;
}
interface IRoomSettingsPageProps
  extends RouteComponentProps<IRoomSettingsPageParams> {
  deleteRoom: (room: IRoom) => void;
  saveRoom: (room: IRoom) => void;
  userProfile: IUserProfile | null;
  userRooms: IRoom[];
}
interface IRoomSettingsPageState {
  roomName: string;
  roomSaving: boolean;
  roomStatus: RoomStatus;
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
      roomName: room ? room.name : '',
      roomSaving: false,
      roomStatus: room ? room.status : RoomStatus.draft,
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

  public onRoomNameChange (event: React.ChangeEvent<HTMLInputElement>) {
    const el = event.currentTarget;
    const roomName = el.value;
    this.setState({ roomName });
  }

  public onRoomActiveChange (roomStatus: RoomStatus) {
    this.setState({ roomStatus });
  }

  public async onRoomSubmit (event: React.MouseEvent<HTMLFormElement>) {
    event.preventDefault();

    this.setState({
      roomSaving: true,
    });

    const room: IRoom = {
      ...this.room!,
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
    const ok = confirm('Are you sure you want to delete this room?');
    if (!ok) {
      return;
    }

    this.setState({
      roomSaving: true,
    });
    this.props.deleteRoom(this.room!);
    appHistory.push('/rooms');
  }
}

export default connect(
  (state: IState) => ({
    userProfile: state.currentUser0.profile,
    userRooms: state.rooms.userRooms,
  }),
  (dispatch: Dispatch) => ({
    deleteRoom: (room: IRoom) => dispatch({ room, type: RoomsActionTypes.deleteRoom }),
    saveRoom: (room: IRoom) => dispatch({ room, type: RoomsActionTypes.saveRoom }),
  }),
)(RoomSettingsPage);
