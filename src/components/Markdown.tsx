import hljs from 'highlight.js';
import MarkdownIt from 'markdown-it';
import React from 'react';

interface IMarkdownProps {
  content: string;
}

export default class Markdown extends React.Component<IMarkdownProps> {
  protected mdit = new MarkdownIt({
    highlight: (text, language) => {
      if (language && hljs.getLanguage(language)) {
        try {
          return hljs.highlight(language, text).value;
        } catch (error) {
          console.error(error);
        }
      }

      return '';
    },
  });

  protected get content () {
    return this.mdit.render(this.props.content);
  }

  public render () {
    return (
      <div dangerouslySetInnerHTML={{ __html: this.content }}/>
    );
  }
}
