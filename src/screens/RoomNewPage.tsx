import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import DefaultLayout from '../complexes/DefaultLayout';
import { appHistory, setTitle } from '../misc';
import * as Rooms from '../models/Rooms';
import { AppDispatch, AppState } from '../models/Store';

const ErrorBlock = styled.div`
  border: 2px solid tomato;
  background-color: salmon;
  color: snow;
  padding: 0.2rem;
`;

interface IRoomNewPageProps {
  createRoom: (room: Rooms.IRoom) => Promise<Rooms.IRoom>;
  userId: string;
}
interface IRoomNewPageState {
  errorMessage: string;
  roomName: string;
  roomSaving: boolean;
}

class RoomNewPage extends React.Component<IRoomNewPageProps, IRoomNewPageState> {
  // protected unsubscribe: (() => void) | null = null;

  public constructor (props: IRoomNewPageProps) {
    super(props);
    this.state = {
      errorMessage: '',
      roomName: '',
      roomSaving: false,
    };
    this.onRoomNameChange = this.onRoomNameChange.bind(this);
    this.onRoomSubmit = this.onRoomSubmit.bind(this);
  }

  public render () {
    return (
      <DefaultLayout>
        <h1>Create new room</h1>
        {this.state.errorMessage && (
          <ErrorBlock>Error: {this.state.errorMessage}</ErrorBlock>
        )}
        <form
          onSubmit={this.onRoomSubmit}
        >
          <table>
            <tbody>
              <tr>
                <th>Name</th>
                <td>
                  <input
                    disabled={this.state.roomSaving}
                    onChange={this.onRoomNameChange}
                    required={true}
                    type="text"
                    value={this.state.roomName}
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
      </DefaultLayout>
    );
  }

  public componentDidMount () {
    setTitle('Create new room');
  }

  public onRoomNameChange (event: React.ChangeEvent<HTMLInputElement>) {
    const el = event.currentTarget;
    const roomName = el.value;
    this.setState({ roomName });
  }

  public async onRoomSubmit (event: React.MouseEvent<HTMLFormElement>) {
    event.preventDefault();
    this.setState({
      roomSaving: true,
    });

    try {
      const roomData: Rooms.IRoom = {
        ...Rooms.emptyRoom,
        name: this.state.roomName,
        userId: this.props.userId,
      };
      const room = await this.props.createRoom(roomData);
      appHistory.push(`/rooms/${room.id}/settings`);
    } catch (error) {
      console.error(error);
      this.setState({
        errorMessage: error.message,
        roomSaving: false,
      });
    }
  }
}

export default connect(
  (state: AppState) => ({
    userId: state.currentUser.id,
  }),
  (dispatch: AppDispatch) => ({
    createRoom: (room: Rooms.IRoom) => dispatch(Rooms.createRoom(room)),
  }),
)(RoomNewPage);
