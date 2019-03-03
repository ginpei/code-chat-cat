import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import DefaultLayout from '../components/DefaultLayout';
import { appHistory } from '../misc';
import { createRoom } from '../models/rooms';
import { Dispatch, IState } from '../reducers';

const ErrorBlock = styled.div`
  border: 2px solid tomato;
  background-color: salmon;
  color: snow;
  padding: 0.2rem;
`;

interface IRoomNewPageProps {
  userId: string;
}
interface IRoomNewPageState {
  errorMessage: string;
  roomName: string;
  roomSaving: boolean;
}

class RoomNewPage extends React.Component<IRoomNewPageProps, IRoomNewPageState> {
  // protected unsubscribe: (() => void) | null = null;

  constructor (props: IRoomNewPageProps) {
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
      const roomData = {
        name: this.state.roomName,
        userId: this.props.userId,
      };
      const room = await createRoom(roomData);
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
  (state: IState) => ({
    userId: state.currentUser.uid,
  }),
)(RoomNewPage);
