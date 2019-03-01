import hljs from 'highlight.js';
import MarkdownIt from 'markdown-it';
import React from 'react';
import styled from 'styled-components';

const MarkdownBlock = styled.div.attrs({
  className: 'Markdown-Container',
})``;

interface IMarkdownProps {
  content: string;
}

export default class Markdown extends React.Component<IMarkdownProps> {
  protected mdit = new MarkdownIt({
    highlight: (text, language) => {
      if (language && hljs.getLanguage(language)) {
        try {
          const highlighted = hljs.highlight(language, text).value;
          return highlighted;
        } catch (error) {
          console.error(error);
        }
      }

      return '';
    },
    html: true,
    langPrefix: 'hljs ',
    linkify: true,
  });

  protected get content () {
    return this.mdit.render(this.props.content);
  }

  constructor (props: IMarkdownProps) {
    super(props);
  }

  public render () {
    return (
      <MarkdownBlock dangerouslySetInnerHTML={{ __html: this.content }}/>
    );
  }
}
