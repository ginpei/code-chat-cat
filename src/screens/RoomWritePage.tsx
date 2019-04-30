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
import { debounce, noop } from '../misc';
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
interface IRoomWritePageProps
  extends RouteComponentProps<IRoomWritePageParams> {
  firebaseUser: firebase.User | null;
  loggedIn: boolean;
  pickRoom: (roomId: string) => Rooms.IRoom;
  saveError: (location: string, error: ErrorLogs.AppError) => void;
  saveRoom: (room: Rooms.IRoom) => void;
  userProfile: Profiles.IProfile | null;
  userRooms: Rooms.IRoom[];
}
interface IRoomWritePageState {
  content: string;
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

  constructor (props: IRoomWritePageProps) {
    super(props);
    const room = props.pickRoom(this.roomId) || Rooms.emptyRoom;
    const content = room ? room.textbookContent : '';
    this.state = {
      content,
      previewingContent: content,
      room,
    };

    this.onContentInput = this.onContentInput.bind(this);
    // this.setRenderingContent = debounce(this.setRenderingContent, 500);
    this.saveContent = debounce(this.saveContent, 500);
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

    const { content, previewingContent } = this.state;

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

  protected setRoom (room: Rooms.IRoom | null) {
    this.setState({ room });

    // update only when it is initial
    if (this.state.content === '') {
      this.setContent(room ? room.textbookContent : '');
    }
  }

  protected setContent (content: string) {
    if (content === this.state.content) {
      return;
    }
    this.setState({ content });
    this.setRenderingContent(content);
    this.saveContent();
  }

  /**
   * This method is debounce. See constructor.
   */
  protected setRenderingContent (previewingContent: string) {
    this.setState({ previewingContent });
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
      textbookContent: this.state.content,
    });
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

    if (this.state.content === '') {
      this.setState({
        content,
      });
    }
  }
}

export default connect(
  (state: AppState) => ({
    firebaseUser: state.currentUser.firebaseUser,
    loggedIn: state.currentUser.loggedIn,
    pickRoom: (roomId: string) => Rooms.pickRoom(state, roomId),
    userProfile: state.currentUser.profile,
    userRooms: Rooms.pickUserRooms(state),
  }),
  (dispatch: AppDispatch) => ({
    saveError: (location: string, error: ErrorLogs.AppError) =>
      dispatch(ErrorLogs.add(location, error)),
    saveRoom: (room: Rooms.IRoom) => dispatch(Rooms.saveRoom(room)),
  }),
)(RoomWritePage);
