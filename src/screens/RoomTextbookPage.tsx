import React, { useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import Markdown from '../components/Markdown';
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

function RoomTextbookPage (props: IRoomTextbookPageProps) {
  if (!props.firebaseUser) {
    return (
      <div>
        <p>401</p>
      </div>
    );
  }

  const roomId = props.match.params.id;
  const [pageStatus, setPageStatus] = useState(PageStatus.initial);
  const [room, setRoom] = useState<IRoom | null>(null);

  if (pageStatus === PageStatus.initial) {
    // TODO unobserve when unmount
    const unobserve = observeRoom(roomId, (updatedRoom) => {
      setRoom(updatedRoom);
      setPageStatus(PageStatus.ready);
    });

    setPageStatus(PageStatus.loading);
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

  const onChangeInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!room) { return; }
    const textbookContent = event.currentTarget.value;
    updateRoom({ ...room, textbookContent });
  };

  const roomName = room ? room.name : '';
  const content = room ? room.textbookContent : '';

  return (
    <div>
      <Header>
        <AppName>{roomName}</AppName>
      </Header>
      <EditorContainer>
        <EditorInput onChange={onChangeInput} value={content} disabled={!content}/>
        <EditorOutput>
          <Markdown content={content} />
        </EditorOutput>
      </EditorContainer>
    </div>
  );
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
