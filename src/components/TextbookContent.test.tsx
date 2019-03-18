import { render } from 'enzyme';
import React from 'react';
import TextbookContent from './TextbookContent';

describe('<TextbookContent>', () => {
  let wrapper: Cheerio;

  describe('markdown rendering', () => {
    beforeEach(() => {
      const content = '# Heading Lv.1';
      wrapper = render(<TextbookContent content={content} />);
    });

    it('renders heading', () => {
      expect(wrapper.find('h1').text()).toContain('Heading Lv.1');
    });
  });

  describe('in public mode', () => {
    beforeEach(() => {
      const content = `# Header 1
---[x]---

**STRONG**

---[ ]---

*EMPHASIZE*`;
      wrapper = render(<TextbookContent content={content} />);
    });

    it('does not render cutter mark', () => {
      expect(wrapper.text()).not.toMatch('---');
    });

    it('cuts text at cutter mark', () => {
      expect(wrapper.find('blockquote')).toHaveLength(0);
    });

    it('does not cut text at accepted cutter mark', () => {
      expect(wrapper.find('h1')).toHaveLength(1);
      expect(wrapper.find('strong')).toHaveLength(1);
    });
  });

  describe('in edit mode', () => {
    beforeEach(() => {
      const content = `# Header 1
---[x]---

**STRONG**

---[ ]---

*EMPHASIZE*`;
      wrapper = render(<TextbookContent content={content} editing={true} />);
    });

    it('renders published separator', () => {
      const separator = wrapper.find('h1').next();
      expect(separator.text()).toMatch('Publish until here');
    });

    it('does not cut after the unpublished separator', () => {
      expect(wrapper.find('strong')).toHaveLength(1);
      expect(wrapper.find('em')).toHaveLength(1);
    });

    it('turns on checkbox for published one', () => {
      const elSeparator = wrapper.find('.TextbookContent-separator').eq(0);
      const elCheckbox = elSeparator.find('input');
      expect(elCheckbox.prop('checked')).toBeTruthy();
    });

    it('turns off checkbox for not-published one', () => {
      const elSeparator = wrapper.find('.TextbookContent-separator').eq(1);
      const elCheckbox = elSeparator.find('input');
      expect(elCheckbox.prop('checked')).toBeFalsy();
    });
  });
});
