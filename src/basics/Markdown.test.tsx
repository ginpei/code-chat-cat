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
      expect(wrapper.find('h1').text()).toContain('Heading Lv.1');
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

  describe('markdown-it-anchor', () => {
    beforeEach(() => {
      const content = '# Header\n## 日本語です';
      wrapper = render(<Markdown content={content} />);
    });

    it('renders headers with links', () => {
      const h1 = wrapper.find('h1');
      expect(h1.text()).toBe('Header ¶');
      expect(h1.attr('id')).toBe('header');
      expect(h1.find('a.header-anchor').attr('href')).toBe('#header');
    });

    it('works with non-English words', () => {
      const h2 = wrapper.find('h2');
      expect(h2.text()).toBe('日本語です ¶');
      expect(h2.attr('id')).toBe(encodeURI('日本語です'));
      expect(h2.find('a.header-anchor').attr('href'))
        .toBe(encodeURI('#日本語です'));
    });
  });

  describe('markdown-it-toc-done-right', () => {
    beforeEach(() => {
      const content = '${toc}\n# Header\n## 日本語です\n# Lv1 2nd';
      wrapper = render(<Markdown content={content} />);
    });

    it('generates table of contents', () => {
      const toc = wrapper.find('.table-of-contents');
      expect(toc.text()).toBe('Header 日本語です Lv1 2nd ');
    });
  });
});
