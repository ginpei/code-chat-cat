import React from 'react';
import styled from 'styled-components';

const SectionSummary = styled.summary`
  font-weight: bold;
  margin: 0 0 1rem;
`;

const RoomSidebarSection: React.FC<{ heading: string }> = (props) => (
  <details className="RoomSidebarSection">
    <SectionSummary>{props.heading}</SectionSummary>
    {props.children}
  </details>
);

export default RoomSidebarSection;
