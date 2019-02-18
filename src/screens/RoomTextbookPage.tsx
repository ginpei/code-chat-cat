import React, { createRef } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import styled, { css } from 'styled-components';
import Markdown from '../components/Markdown';
import syncScroll from '../functions/syncScroll';
import { Dispatch, IState } from '../reducers';
import { IRoom, RoomsActionTypes } from '../reducers/rooms';
import { observeRoom, updateRoom } from '../rooms';

const headerHeight = 12 * 1.6;

const Header = styled.header`
  background-color: #036;
  color: #fff;
  font-size: 12px;
  height: 1.6em;
  line-height: 1.6em;
  padding: 0 1rem;
`;
const AppName = styled.div`
  font-weight: bold;
`;
const EditorContainer = styled.div`
  display: grid;
  grid-template: "input output" 100% / 1fr 1fr;
  height: calc(100vh - ${headerHeight}px);
`;
const EditorInput = styled.textarea`
  background-color: #f0f0f0;
  border-style: none;
  overflow-y: scroll;
  padding: 1rem;
  resize: none;

  ${(props) => props.disabled && css`
    box-shadow: 0 0 50vmin #0003 inset;
  `}
`;
const EditorOutput = styled.article`
  overflow-y: scroll;
  padding: 1rem;
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
      pageStatus: PageStatus.initial,
      room: null,
    };

    this.onContentInput = this.onContentInput.bind(this);
  }

  public render () {
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
        <Header>
          <AppName>{roomName}</AppName>
        </Header>
        <EditorContainer>
          <EditorInput
            ref={this.refInput}
            onChange={this.onContentInput}
            value={content}
            disabled={!room}
          />
          <EditorOutput
            ref={this.refOutput}
          >
            <Markdown content={content} />
          </EditorOutput>
        </EditorContainer>
      </div>
    );
  }

  public componentDidMount () {
    this.unobserve = observeRoom(this.roomId, (updatedRoom) => {
      this.setState({
        content: updatedRoom ? updatedRoom.textbookContent : '',
        pageStatus: PageStatus.ready,
        room: updatedRoom,
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

  public componentDidUpdate () {
    const elInput = this.refInput.current;
    const elOutput = this.refOutput.current;
    if (!elInput || !elOutput) {
      return;
    }

    if (this.unsubscribeSyncScroll) {
      this.unsubscribeSyncScroll();
    }
    this.unsubscribeSyncScroll = syncScroll([elInput, elOutput]);
  }

  public onContentInput (event: React.ChangeEvent<HTMLTextAreaElement>) {
    const { room } = this.state;
    if (!room) {
      return;
    }

    const newContent = event.currentTarget.value;
    this.setState({
      content: newContent,
    });
    updateRoom({ ...room, textbookContent: newContent });
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
