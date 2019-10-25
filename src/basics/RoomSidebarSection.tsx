import React, { ComponentPropsWithRef } from 'react';
import styled from 'styled-components';

const SectionSummary = styled.summary`
  font-weight: bold;
  margin: 0 0 1rem;
`;

type Props = ComponentPropsWithRef<'details'> & {
  heading: string;
}

const RoomSidebarSection: React.FC<Props> = (props) => {
  const { heading, ...domProps } = props;

  return (
    <details {...domProps} className="RoomSidebarSection">
      <SectionSummary>
        <span>{props.heading}</span>
      </SectionSummary>
      {props.children}
    </details>
  );
};

export default RoomSidebarSection;
