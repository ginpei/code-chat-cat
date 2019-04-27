import React from 'react';

const map = {
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

interface IEmojiProps extends ISpanProps {
  label: EmojiLabel;
}

export default function Emoji (props: IEmojiProps) {
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

export function CheckEmoji (props: ISpanProps) {
  return <Emoji {...props} label="White Heavy Check Mark" />;
}

export function FireEmoji (props: ISpanProps) {
  return <Emoji {...props} label="Fire" />;
}

export function SpeechBalloonEmoji (props: ISpanProps) {
  return <Emoji {...props} label="Speech Balloon" />;
}

export function OpenBookEmoji (props: ISpanProps) {
  return <Emoji {...props} label="Open Book" />;
}

export function MemoEmoji (props: ISpanProps) {
  return <Emoji {...props} label="Memo" />;
}
