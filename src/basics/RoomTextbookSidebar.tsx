import React from 'react';
import styled from 'styled-components';
import { Room } from '../models/Rooms';

const SectionSummary = styled.summary`
  font-weight: bold;
  margin: 0 0 1rem;
`;

const SidebarSection: React.FC<{ heading: string }> = (props) => (
  <details>
    <SectionSummary>{props.heading}</SectionSummary>
    {props.children}
  </details>
);

const RoomTextbookSidebarOuter = styled.div`
  padding-bottom: 5em;
`;

const IndexList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const IndexListItem = styled.li``;

type Props = {
  room: Room;
}

const RoomTextbookSidebar: React.FC<Props> = (props) => {
  const { room } = props;
  const headings = getActiveTextbookHeadings(room);
  return (
    <RoomTextbookSidebarOuter className="RoomTextbookSidebar">
      <SidebarSection heading="Index">
        <IndexList>
          {headings.map((heading) => (
            <IndexListItem
              key={heading.content}
              style={{
                marginLeft: `${heading.level - 2}em`,
              }}
            >
              <a
                href={`#${slugify(heading.content)}`}
              >
                {heading.content}
              </a>
            </IndexListItem>
          ))}
        </IndexList>
      </SidebarSection>
    </RoomTextbookSidebarOuter>
  );
};

// WIP
function getActiveTextbookHeadings(room: Room) {
  const lines = room.textbookContent.split('\n');
  const headingLines = lines.filter((v) => v.startsWith('#'));
  const headings = headingLines.map((line) => {
    const iFirstSpace = line.indexOf(' ');
    const content = line.slice(iFirstSpace).trim();
    const level = iFirstSpace;
    return { content, level };
  });
  const indexedHeadings = headings.filter((v) => v.level > 1);
  return indexedHeadings;
}

function slugify(s: string) {
  // see https://github.com/valeriangalliat/markdown-it-anchor/blob/v5.2.5/index.js#L1
  return encodeURIComponent(String(s).trim().toLowerCase().replace(/\s+/g, '-'));
}

export default RoomTextbookSidebar;
