import React, { createRef } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import Container from '../components/Container';
import Header, { headerHeight } from '../components/Header';
import Markdown from '../components/Markdown';
import { Dispatch, IState } from '../reducers';
import { IRoom, RoomsActionTypes } from '../reducers/rooms';
import { observeRoom } from '../rooms';

const TextbookContainer = styled.div`
  height: calc(100vh - ${headerHeight}px);
  overflow-y: scroll;
`;
const TextbookContent = styled(Container)`
  background-color: snow;
  box-shadow: 0 0 10px #0003;
  min-height: 100%;
  padding: 0.01px 1rem;
`;

enum PageStatus {
  initial,
  loading,
  ready,
}

interface IRoomTextbookPageParams {
  id: string;
}
interface IRoomTextbookPageProps
  extends RouteComponentProps<IRoomTextbookPageParams> {
  firebaseUser: firebase.User | null;
  loggedIn: boolean;
  setRooms: (rooms: IRoom[]) => void;
  userName: string;
}
interface IRoomTextbookPageState {
  content: string;
  errorMessage: string;
  pageStatus: PageStatus;
  room: IRoom | null;
}

class RoomTextbookPage extends React.Component<IRoomTextbookPageProps, IRoomTextbookPageState> {
  protected refInput = createRef<HTMLTextAreaElement>();
  protected refOutput = createRef<HTMLElement>();
  protected unobserve: (() => void) | null = null;
  protected unsubscribeSyncScroll: (() => void) | null = null;

  protected get roomId () {
    return this.props.match.params.id;
  }

  constructor (props: IRoomTextbookPageProps) {
    super(props);
    this.state = {
      content: '',
      errorMessage: '',
      pageStatus: PageStatus.initial,
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

    const { content, pageStatus, room } = this.state;

    if (pageStatus === PageStatus.initial) {
      return (
        <div title="Initializing room">...</div>
      );
    }

    if (pageStatus === PageStatus.ready && !room) {
      return (
        <div>
          <p>404</p>
        </div>
      );
    }

    const roomName = room ? room.name : '';

    return (
      <div>
        <Header
          title={roomName}
          titleHref={`/rooms/${this.roomId}`}
        />
        {room && (
          <TextbookContainer>
            <TextbookContent>
              <Markdown content={content} />
            </TextbookContent>
          </TextbookContainer>
        )}
      </div>
    );
  }

  public componentDidMount () {
    this.unobserve = observeRoom(this.roomId, (error, updatedRoom) => {
      if (error) {
        this.setState({
          errorMessage: error.message,
        });
        console.error(error);
        return;
      }

      this.setState({
        content: updatedRoom ? updatedRoom.textbookContent : '',
        errorMessage: '',
        pageStatus: PageStatus.ready,
        room: updatedRoom || null,
      });
    });

    this.setState({
      pageStatus: PageStatus.loading,
    });
  }

  public componentWillUnmount () {
    if (this.unobserve) {
      this.unobserve();
    }

    if (this.unsubscribeSyncScroll) {
      this.unsubscribeSyncScroll();
    }
  }
}

const mapStateToProps = (state: IState) => ({
  firebaseUser: state.currentUser.firebaseUser,
  loggedIn: state.currentUser.loggedIn,
  userName: state.currentUser.name,
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
)(RoomTextbookPage);
