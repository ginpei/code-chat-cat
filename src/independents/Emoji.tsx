import React from 'react';

const map = {
  'CatCry': '😿',
  'Fire': '🔥',
  'Lock': '🔒',
  'Memo': '📝',
  'Open Book': '📖',
  'Speech Balloon': '💬',
  'White Heavy Check Mark': '✅',
};

type EmojiLabel = keyof typeof map;

export function getEmojiChar (label: EmojiLabel) {
  return map[label];
}

type ISpanProps = React.ComponentPropsWithRef<'span'>;

interface Props extends ISpanProps {
  label: EmojiLabel;
}

export default function Emoji (props: Props) {
  const { label, ...spanProps } = props;
  const emoji = getEmojiChar(label);

  return (
    <span
      {...spanProps}
      aria-label={label}
      role="img"
    >
      {emoji}
    </span>
  );
}

export function LockEmoji (props: ISpanProps) {
  return <Emoji {...props} label="Lock" />;
}
