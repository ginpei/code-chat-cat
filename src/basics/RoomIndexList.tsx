import React from 'react';
import styled from 'styled-components';
import { Room } from '../models/Rooms';

const OuterUl = styled.ul`
  list-style-type: none;
  padding: 0;
`;

type Props = {
  room: Room;
}

const RoomIndexList: React.FC<Props> = ({ room }) => {
  const headings = getActiveTextbookHeadings(room);
  return (
    <OuterUl>
      {headings.map((heading) => (
        <li
          key={heading.slug}
          style={{
            marginLeft: `${heading.level - 2}em`,
          }}
        >
          {heading.cut ? (
            <span>{heading.content}</span>
          ) : (
            <a href={`#${heading.slug}`}>{heading.content}</a>
          )}
        </li>
      ))}
    </OuterUl>
  );
};

function getActiveTextbookHeadings(room: Room) {
  const slugCounts = new Map<string, number>();

  let cut = false;

  const lines = room.textbookContent.split('\n');
  const headingLines = lines.filter(
    (v) => v === '<!--[ ]-->' || v.startsWith('#'),
  );
  const headings = headingLines.map((line) => {
    if (line === '<!--[ ]-->') {
      cut = true;
      return { level: -1 };
    }

    const iFirstSpace = line.indexOf(' ');
    const content = line.slice(iFirstSpace).trim();
    const level = iFirstSpace;

    let slug = slugify(content);
    if (slugCounts.has(slug)) {
      const count = slugCounts.get(slug)!;
      slugCounts.set(slug, count + 1);
      slug += `-${count + 1}`;
    } else {
      slugCounts.set(slug, 1);
    }

    return {
      content, cut, level, slug,
    };
  });
  const indexedHeadings = headings.filter((v) => v.level > 1);
  return indexedHeadings;
}

function slugify(s: string) {
  // see https://github.com/valeriangalliat/markdown-it-anchor/blob/v5.2.5/index.js#L1
  return encodeURIComponent(String(s).trim().toLowerCase().replace(/\s+/g, '-'));
}

export default RoomIndexList;
