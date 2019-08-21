import 'highlight.js/styles/atom-one-dark.css';
import React, { createRef } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { headerHeight } from '../basics/Header';
import RoomHeader from '../basics/RoomHeader';
import TextbookContent from '../basics/TextbookContent';
import syncScroll from '../functions/syncScroll';
import LoadingView from '../independents/LoadingView';
import { debounce, noop, setTitle } from '../misc';
import * as ErrorLogs from '../models/ErrorLogs';
import * as Profiles from '../models/Profiles';
import * as Rooms from '../models/Rooms';
import { AppDispatch, AppState } from '../models/Store';
import NotFoundPage from './NotFoundPage';

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

interface IRoomWritePageParams {
  id: string;
}

interface IRoomWritePageStateProps {
  firebaseUser: firebase.User | null;
  pickRoom: (roomId: string) => Rooms.IRoom;
  userProfile: Profiles.IProfile | null;
}

const mapStateToProps = (state: AppState): IRoomWritePageStateProps => ({
  firebaseUser: state.currentUser.firebaseUser,
  pickRoom: (roomId: string) => Rooms.pickRoom(state, roomId),
  userProfile: state.currentUser.profile,
});

interface IRoomWritePageDispatchProps {
  saveError: (location: string, error: ErrorLogs.AppError) => void;
  saveRoom: (room: Rooms.IRoom) => void;
}

const mapDispatchToProps = (dispatch: AppDispatch): IRoomWritePageDispatchProps => ({
  saveError: (location: string, error: ErrorLogs.AppError) => dispatch(ErrorLogs.add(location, error)),
  saveRoom: (room: Rooms.IRoom) => dispatch(Rooms.saveRoom(room)),
});

type IRoomWritePageProps =
  & RouteComponentProps<IRoomWritePageParams>
  & IRoomWritePageStateProps
  & IRoomWritePageDispatchProps;

interface IRoomWritePageState {
  editingContent: string;
  previewingContent: string;
  room: Rooms.IRoom | null;
}

class RoomWritePage extends React.Component<IRoomWritePageProps, IRoomWritePageState> {
  protected refInput = createRef<HTMLTextAreaElement>();
  protected refOutput = createRef<HTMLElement>();
  protected unsubscribeSyncScroll: (() => void) | null = null;
  protected unsubscribeRoom = noop;

  protected get roomId () {
    return this.props.match.params.id;
  }

  public constructor (props: IRoomWritePageProps) {
    super(props);
    const room = props.pickRoom(this.roomId) || Rooms.emptyRoom;
    const content = room ? room.textbookContent : '';
    this.state = {
      editingContent: content,
      previewingContent: content,
      room,
    };

    this.onContentInput = this.onContentInput.bind(this);
    this.setRenderingContent = debounce(this.setRenderingContent, 500);
    this.saveContent = debounce(this.saveContent, 3000);
  }

  public render () {
    if (!this.props.firebaseUser) {
      return (
        <div>
          <p>401</p>
        </div>
      );
    }

    const { room } = this.state;

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

    const { editingContent: content, previewingContent } = this.state;

    return (
      <div>
        <RoomHeader
          fullscreen={true}
          room={room}
          userProfile={this.props.userProfile}
        />
        <EditorContainer>
          <EditorInput
            ref={this.refInput}
            onChange={this.onContentInput}
            value={content}
          />
          <EditorOutput
            ref={this.refOutput}
          >
            <TextbookContent editing={true} content={previewingContent} />
          </EditorOutput>
        </EditorContainer>
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
    );

    this.subscribeSyncScroll();
  }

  public componentWillUnmount () {
    this.unsubscribeRoom();
    if (this.unsubscribeSyncScroll) {
      this.unsubscribeSyncScroll();
    }
  }

  public componentDidUpdate () {
    this.subscribeSyncScroll();
  }

  public async onContentInput (event: React.ChangeEvent<HTMLTextAreaElement>) {
    const content = event.currentTarget.value;
    this.setContent(content);
  }

  protected updateTitle () {
    const { room } = this.state;
    setTitle('Write', room ? room.name : '...');
  }

  protected setRoom (room: Rooms.IRoom | null) {
    this.setState({ room });
    this.updateTitle();

    // update only when it is initial
    if (this.state.editingContent === '') {
      this.setContent(room ? room.textbookContent : '');
    }
  }

  protected setContent (content: string) {
    if (content === this.state.editingContent) {
      return;
    }
    this.setState({ editingContent: content });
    this.setRenderingContent(content);
    this.setDirty();
    this.saveContent();
  }

  /**
   * This method is debounce. See constructor.
   */
  protected setRenderingContent (previewingContent: string) {
    this.setState({ previewingContent });
  }

  protected setDirty () {
    window.onbeforeunload = (event) => {
      event.preventDefault();
      event.returnValue = ''; // for Chrome
    };
  }

  protected unsetDirty () {
    window.onbeforeunload = null;
  }

  /**
   * This method is debounce. See constructor.
   */
  protected saveContent () {
    const { room } = this.state;
    if (!room) {
      return;
    }

    this.props.saveRoom({
      ...room,
      textbookContent: this.state.editingContent,
    });
    this.unsetDirty();
  }

  protected subscribeSyncScroll () {
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

  protected updateContent (content: string) {
    // Just update current content to the value from server.
    // This won't reflect remote modification to your screen.

    if (this.state.editingContent === '') {
      this.setState({
        editingContent: content,
      });
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RoomWritePage);
