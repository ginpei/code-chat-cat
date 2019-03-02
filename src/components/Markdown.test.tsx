import { render } from 'enzyme';
import React from 'react';
import Markdown from './Markdown';

describe('<Markdown>', () => {
  let wrapper: Cheerio;

  describe('markdown rendering', () => {
    beforeEach(() => {
      const content = '# Heading Lv.1\n\nThe `first` paragraph.';
      wrapper = render(<Markdown content={content} />);
    });

    it('renders heading', () => {
      expect(wrapper.find('h1').text()).toBe('Heading Lv.1');
    });

    it('renders paragraph', () => {
      expect(wrapper.find('p').text()).toBe('The first paragraph.');
      expect(wrapper.find('p code').text()).toBe('first');
    });
  });

  describe('highlight.js', () => {
    beforeEach(() => {
      const content = '```js\nconst foo = "TEXT";\n```';
      wrapper = render(<Markdown content={content} />);
    });

    it('renders in the language', () => {
      expect(wrapper.find('pre')).toHaveLength(1);
      expect(wrapper.find('pre > code.hljs.js')).toHaveLength(1);
      expect(wrapper.find('pre > code > .hljs-keyword')).toHaveLength(1);
      expect(wrapper.find('pre > code > .hljs-keyword').text()).toBe('const');
    });
  });
});
