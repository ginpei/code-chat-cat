import React, { useState } from 'react';
import styled from 'styled-components';
import { IRoomTask } from '../reducers/rooms';
import Markdown from './Markdown';

const Block = styled.div`
  display: grid;
  grid-template:
    "title closed" auto
    "content content" 10em
    / 1fr 7em;
`;
const TaskTitle = styled.input.attrs({
  type: 'text',
})`
  grid-area: title;
`;
const TaskContent = styled.textarea`
  grid-area: content;
`;

const TaskClosed = (props: any) => {
  const { checked, onChange, ref } = props;
  return (
    <label>
      <input
        checked={checked}
        onChange={onChange}
        ref={ref}
        type="checkbox"
      />
      Closed
    </label>
  );
};

interface IRoomTaskEditProps {
  onChange: (task: IRoomTask) => void;
  task: IRoomTask;
}

export default function RoomTaskEdit (props: IRoomTaskEditProps) {
  const refTitle = React.createRef<HTMLInputElement>();
  const refClosedCheckbox = React.createRef<HTMLInputElement>();
  const refContent = React.createRef<HTMLTextAreaElement>();

  const { task } = props;

  const onChange = () => props.onChange({
    closed: refClosedCheckbox.current!.checked,
    id: task.id,
    mdContent: refContent.current!.value,
    title: refTitle.current!.value,
  });

  return (
    <Block>
      <TaskTitle
        onChange={onChange}
        ref={refTitle}
        value={task.title}
      />
      <TaskClosed
        checked={task.closed}
        onChange={onChange}
        ref={refClosedCheckbox}
      />
      <TaskContent
        onChange={onChange}
        ref={refContent}
        value={task.mdContent}
      />
    </Block>
  );
}
