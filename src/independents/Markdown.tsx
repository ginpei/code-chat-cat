import hljs from 'highlight.js';
import MarkdownIt from 'markdown-it';
import markdownItAnchor from 'markdown-it-anchor';
import React from 'react';
import styled from 'styled-components';
import './Markdown.css';

// html-to-react does not have type definition
const HtmlToReactParser = require('html-to-react').Parser;

const MarkdownBlock = styled.div.attrs({
  className: 'Markdown-Container',
})``;

interface Props {
  content: string;
}

export default class Markdown extends React.Component<Props> {
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

  protected htmlToReactParser = new HtmlToReactParser();

  protected get contentHtml () {
    return this.mdit.render(this.props.content);
  }

  public constructor (props: Props) {
    super(props);
    this.mdit.use(markdownItAnchor, {
      permalink: true,
    });
  }

  public render () {
    return (
      <MarkdownBlock>
        {this.htmlToReactParser.parse(this.contentHtml)}
      </MarkdownBlock>
    );
  }
}
