import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import DefaultLayout from '../components/DefaultLayout';
import { connectRoom } from '../models/rooms';
import { Dispatch, IState } from '../reducers';
import { IRoom, RoomsActionTypes } from '../reducers/rooms';

interface IRoomSettingsPageParams {
  id: string;
}
interface IRoomSettingsPageProps
  extends RouteComponentProps<IRoomSettingsPageParams> {
  firebaseUser: firebase.User | null;
  loggedIn: boolean;
}
interface IRoomSettingsPageState {
  errorMessage: string;
  room: IRoom | null;
}

class RoomSettingsPage extends React.Component<IRoomSettingsPageProps, IRoomSettingsPageState> {
  protected unsubscribe: (() => void) | null = null;

  protected get roomId () {
    return this.props.match.params.id;
  }

  constructor (props: IRoomSettingsPageProps) {
    super(props);
    this.state = {
      errorMessage: '',
      room: null,
    };
  }

  public render () {
    // TODO error view
    if (this.state.errorMessage) {
      return (
        <div>
          <p>{this.state.errorMessage}</p>
        </div>
      );
    }

    if (!this.props.firebaseUser) {
      return (
        <div>
          <p>401</p>
        </div>
      );
    }

    const room = this.state.room;
    if (!room) {
      return (
        <div>
          <p>404</p>
        </div>
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
        <table>
          <tbody>
            <tr>
              <th>ID</th>
              <td>{room.id}</td>
            </tr>
            <tr>
              <th>Name</th>
              <td>{room.name}</td>
            </tr>
            <tr>
              <th>Active</th>
              <td>{String(room.active)}</td>
            </tr>
          </tbody>
        </table>
      </DefaultLayout>
    );
  }

  public componentDidMount () {
    this.unsubscribe = connectRoom(this.roomId, (room) => {
      this.setState({ room });
    });
  }

  public componentWillUnmount () {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}

const mapStateToProps = (state: IState) => ({
  firebaseUser: state.currentUser.firebaseUser,
  loggedIn: state.currentUser.loggedIn,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setRooms: (rooms: IRoom[]) => dispatch({
    rooms,
    type: RoomsActionTypes.setRooms,
  }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RoomSettingsPage);
