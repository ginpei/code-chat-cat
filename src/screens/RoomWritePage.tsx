import 'highlight.js/styles/atom-one-dark.css';
import React, { createRef } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import styled, { css } from 'styled-components';
import Header, { headerHeight } from '../components/Header';
import LoadingView from '../components/LoadingView';
import Markdown from '../components/Markdown';
import syncScroll from '../functions/syncScroll';
import { observeRoom, updateRoom } from '../models/rooms';
import { Dispatch, IState } from '../reducers';
import { IRoom, RoomsActionTypes } from '../reducers/rooms';

const EditorContainer = styled.div`
  display: grid;
  grid-template: "input output" 100% / 1fr 1fr;
  height: calc(100vh - ${headerHeight}px);
`;
const EditorInput = styled.textarea`
  background-color: ivory;
  border-style: none;
  overflow-y: scroll;
  padding: 1rem;
  resize: none;

  ${(props) => props.disabled && css`
    box-shadow: 0 0 50vmin #0003 inset;
  `}
`;
const EditorOutput = styled.article`
  background-color: snow;
  overflow-y: scroll;
  padding: 1rem;
`;

enum PageStatus {
  initial,
  loading,
  ready,
}

interface IRoomWritePageParams {
  id: string;
}
interface IRoomWritePageProps
  extends RouteComponentProps<IRoomWritePageParams> {
  firebaseUser: firebase.User | null;
  loggedIn: boolean;
  setRooms: (rooms: IRoom[]) => void;
}
interface IRoomWritePageState {
  content: string;
  errorMessage: string;
  pageStatus: PageStatus;
  room: IRoom | null;
}

class RoomWritePage extends React.Component<IRoomWritePageProps, IRoomWritePageState> {
  protected refInput = createRef<HTMLTextAreaElement>();
  protected refOutput = createRef<HTMLElement>();
  protected unobserve: (() => void) | null = null;
  protected unsubscribeSyncScroll: (() => void) | null = null;

  protected get roomId () {
    return this.props.match.params.id;
  }

  constructor (props: IRoomWritePageProps) {
    super(props);
    this.state = {
      content: '',
      errorMessage: '',
      pageStatus: PageStatus.initial,
      room: null,
    };

    this.onContentInput = this.onContentInput.bind(this);
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
        <LoadingView/>
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
          fullscreen={true}
          title={roomName}
          titleHref={`/rooms/${this.roomId}`}
        />
        {room && (
          <EditorContainer>
            <EditorInput
              ref={this.refInput}
              onChange={this.onContentInput}
              value={content}
            />
            <EditorOutput
              ref={this.refOutput}
            >
              <Markdown content={content} />
            </EditorOutput>
          </EditorContainer>
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
        pageStatus: PageStatus.ready,
        room: updatedRoom || null,
      });

      this.updateContent(updatedRoom ? updatedRoom.textbookContent : '');
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
    if (this.unsubscribeSyncScroll) {
      this.unsubscribeSyncScroll();
    }

    const els = [
      this.refInput.current!,
      this.refOutput.current!,
    ];
    if (!els.every((v) => Boolean(v))) {
      return;
    }

    this.unsubscribeSyncScroll = syncScroll(els);
  }

  public async onContentInput (event: React.ChangeEvent<HTMLTextAreaElement>) {
    const { room } = this.state;
    if (!room) {
      return;
    }

    const newContent = event.currentTarget.value;
    this.setState({
      content: newContent,
    });
    try {
      await updateRoom({ ...room, textbookContent: newContent });
    } catch (error) {
      this.setState({
        errorMessage: error.message,
      });
      console.error(error);
    }
  }

  protected updateContent (content: string) {
    // Just update current content to the value from server.
    // This won't reflect remote modification to your screen.

    if (this.state.content === '') {
      this.setState({
        content,
      });
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
)(RoomWritePage);
