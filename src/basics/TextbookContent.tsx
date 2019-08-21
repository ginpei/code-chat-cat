import React from 'react';
import Markdown from '../independents/Markdown';
import './TextbookContent.css';

function generateSeparatorHtml (published: boolean) {
  // TODO click checkbox to toggle published status
  return `
  <div class="TextbookContent-separator" data-published="${String(published)}">
    <label class="TextbookContent-separatorLabel">
      <input type="checkbox" ${published ? 'checked' : ''} disabled />
      Publish until here
    </label>
  </div>
  `.trim();
}

function buildEditingContent (content: string) {
  const modified = content
    .replace(/\n<!--\[ ?\]-->\n/g, `\n${generateSeparatorHtml(false)}\n`)
    .replace(/\n<!--\[x\]-->\n/g, `\n${generateSeparatorHtml(true)}\n`);
  return modified;
}

function buildPublishedContent (content: string) {
  const index = Math.max(
    content.indexOf('\n<!--[]-->\n'),
    content.indexOf('\n<!--[ ]-->\n'),
  );
  const sliced = index < 0 ? content : content.slice(0, index);
  const modified = sliced.replace(/\n<!--\[x\]-->\n/g, '\n');
  return modified;
}

interface ITextbookContentProps {
  editing?: boolean;
  content: string;
}

export default class TextbookContent extends React.Component<
ITextbookContentProps
> {
  protected get modifiedContent () {
    const { editing = false, content } = this.props;
    return editing
      ? buildEditingContent(content)
      : buildPublishedContent(content);
  }

  public render () {
    return <Markdown content={this.modifiedContent} />;
  }
}
