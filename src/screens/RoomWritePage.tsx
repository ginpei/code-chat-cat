import 'highlight.js/styles/atom-one-dark.css';
import React, { createRef } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { headerHeight } from '../components/Header';
import RoomHeader from '../components/RoomHeader';
import TextbookContent from '../components/TextbookContent';
import syncScroll from '../functions/syncScroll';
import { Dispatch, IState } from '../reducers';
import { IUserProfile } from '../reducers/currentUser';
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

interface IRoomWritePageParams {
  id: string;
}
interface IRoomWritePageProps
  extends RouteComponentProps<IRoomWritePageParams> {
  firebaseUser: firebase.User | null;
  loggedIn: boolean;
  saveRoom: (room: IRoom) => void;
  userProfile: IUserProfile | null;
  userRooms: IRoom[];
}
interface IRoomWritePageState {
  content: string;
}

class RoomWritePage extends React.Component<IRoomWritePageProps, IRoomWritePageState> {
  protected refInput = createRef<HTMLTextAreaElement>();
  protected refOutput = createRef<HTMLElement>();
  protected unsubscribeSyncScroll: (() => void) | null = null;

  protected get roomId () {
    return this.props.match.params.id;
  }

  protected get room () {
    return this.props.userRooms.find((v) => v.id === this.roomId) || null;
  }

  constructor (props: IRoomWritePageProps) {
    super(props);
    this.state = {
      content: this.room ? this.room.textbookContent : '',
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

    if (!this.room) {
      return (
        <div>
          <p>404</p>
        </div>
      );
    }

    const { room } = this;
    const { content } = this.state;

    const roomName = room.name;

    return (
      <div>
        <RoomHeader
          fullscreen={true}
          room={room}
          userProfile={this.props.userProfile}
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
              <TextbookContent editing={true} content={content} />
            </EditorOutput>
          </EditorContainer>
        )}
      </div>
    );
  }

  public componentDidMount () {
    this.subscribeSyncScroll();
  }

  public componentWillUnmount () {
    if (this.unsubscribeSyncScroll) {
      this.unsubscribeSyncScroll();
    }
  }

  public componentDidUpdate () {
    this.subscribeSyncScroll();
  }

  public async onContentInput (event: React.ChangeEvent<HTMLTextAreaElement>) {
    const { room } = this;
    if (!room) {
      return;
    }

    const newContent = event.currentTarget.value;
    this.setState({
      content: newContent,
    });

    this.props.saveRoom({ ...room!, textbookContent: newContent });
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
  (state: IState) => ({
    firebaseUser: state.currentUser.firebaseUser,
    loggedIn: state.currentUser.loggedIn,
    userProfile: state.currentUser.profile,
    userRooms: state.rooms.userRooms,
  }),
  (dispatch: Dispatch) => ({
    saveRoom: (room: IRoom) => dispatch({ room, type: RoomsActionTypes.saveRoom }),
  }),
)(RoomWritePage);
