import React, { useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import Markdown from '../components/Markdown';

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
  background-color: #eee;
  border-style: none;
  padding: 0.4rem;
  resize: none;
`;
const EditorOutput = styled.article`
  padding: 0.4rem;
`;

interface IRoomTextbookPageParams {
  id: string;
}
interface IRoomTextbookPageProps
  extends RouteComponentProps<IRoomTextbookPageParams> {
  loggedIn: boolean;
  userName: string;
}

function RoomTextbookPage (props: IRoomTextbookPageProps) {
  const roomId = props.match.params.id;
  const [state, update] = useState({
    text: '# Hello World!\n\nEdit here!',
  });

  const onChangeInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    return update({ text: event.currentTarget.value });
  };

  return (
    <div>
      <Header>
        <AppName>Room {roomId}</AppName>
      </Header>
      <EditorContainer>
        <EditorInput onChange={onChangeInput}>{state.text}</EditorInput>
        <EditorOutput>
          <Markdown content={state.text} />
        </EditorOutput>
      </EditorContainer>
    </div>
  );
}

const mapStateToProps = (state: any) => ({
  loggedIn: state.currentUser.loggedIn,
  userName: state.currentUser.name,
});

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RoomTextbookPage);
