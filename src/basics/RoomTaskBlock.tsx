import React, { useState } from 'react';
import styled from 'styled-components';
import Markdown from './Markdown';

const TaskTitle = styled.h1`
  font-size: 1em;
`;
const DoneButton = styled.button`
  border-width: 1px;
  border-style: solid;
  color: green;
  font-size: 1em;
  padding: 0.1em 0.5em;
  min-width: 4em;

  &:active {
    padding: 0.2em 0.4em 0 0.6em;
  }
`;

interface IRoomTaskBlockProps {
  closed: boolean;
  mdContent: string;
  title: string;
}

// TODO rename
export default function RoomTaskBlock (props: IRoomTaskBlockProps) {
  const [done, setDone] = useState(false);

  const onDoneClick = () => setDone(true);
  const onCancelClick = () => setDone(false);

  return (
    <details open={!props.closed}>
      <summary>{props.title}</summary>
      <Markdown content={props.mdContent} />
      {!props.closed && (
        <p>
          {done ? (
            <button className="link" onClick={onCancelClick}>Cancel done</button>
          ) : (
            <DoneButton onClick={onDoneClick}>✓ Done</DoneButton>
          )}
        </p>
      )}
    </details>
  );
}
