import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import HeaderMenu, { IHeaderMenu } from './HeaderMenu';

describe('path', () => {
  let wrapper: ShallowWrapper;

  describe('default', () => {
    beforeEach(() => {
      wrapper = shallow(<HeaderMenu />);
    });

    it('is ok', () => {
      expect(wrapper).not.toBeNull();
    });
  });

  describe('specified menu items', () => {
    beforeEach(() => {
      const menus: IHeaderMenu[] = [
        {
          links: [
            { href: '/path1-1', title: 'link1-1' },
            { href: '/path1-2', title: 'link1-2' },
          ],
          name: 'group1',
        },
        {
          links: [
          ],
          name: 'group2',
        },
      ];
      wrapper = shallow(<HeaderMenu menus={menus} />);
    });

    it('has group 1 and 2', () => {
      expect(wrapper.prop('children')).toHaveLength(2);
    });

    it('sets title to group 1', () => {
      expect(wrapper.childAt(0).childAt(0).text()).toBe('group1');
    });

    it('lays 2 links under group 1', () => {
      expect(wrapper.childAt(0).childAt(1).children()).toHaveLength(2);
      expect(wrapper.childAt(0).childAt(1).childAt(0).text()).toBe('link1-1');
      expect(wrapper.childAt(0).childAt(1).childAt(1).text()).toBe('link1-2');
    });

    it('sets title to group 2', () => {
      expect(wrapper.childAt(1).childAt(0).text()).toBe('group2');
    });

    it('allows empty list', () => {
      expect(wrapper.childAt(1).childAt(1).children()).toHaveLength(0);
    });
  });
});
