import { mount, shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Container from './Container';
import Header, { FullscreenContainer } from './Header';
import { IHeaderMenu } from './HeaderMenu';

describe('<Header>', () => {
  let wrapper: ShallowWrapper;
  let container: ShallowWrapper;

  describe('default', () => {
    beforeEach(() => {
      wrapper = shallow(<Header/>);
      container = wrapper.childAt(0).childAt(0);
    });

    it('renders app name as title', () => {
      const title = container.childAt(0);
      expect(title.text()).toBe('Code Chat Cat');
    });

    it('sets link to home to the title', () => {
      const title = container.childAt(0);
      const link = title.childAt(0);
      expect(link.prop('to')).toBe('/');
    });

    it('renders no menus', () => {
      const menus = container.childAt(1);
      expect(menus.prop('menus')).toEqual([]);
    });
  });

  describe('fullscreen', () => {
    it('renders in container', () => {
      const w = mount((
        <BrowserRouter>
          <Header/>
        </BrowserRouter>
      ));
      expect(w.find(Container)).toHaveLength(1);
    });

    it('renders in fullscreen size', () => {
      const w = mount((
        <BrowserRouter>
          <Header fullscreen={true} />
        </BrowserRouter>
      ));
      expect(w.find(FullscreenContainer)).toHaveLength(1);
    });
  });

  describe('title', () => {
    beforeEach(() => {
      wrapper = shallow(<Header title="Hey Yo" />);
      container = wrapper.childAt(0).childAt(0);
    });

    it('renders the specified title', () => {
      const title = container.childAt(0);
      expect(title.text()).toBe('Hey Yo');
    });

    it('sets no link to the title', () => {
      const title = container.childAt(0);
      const link = title.childAt(0);
      expect(link.prop('to')).toBeUndefined();
    });
  });

  describe('title and link', () => {
    beforeEach(() => {
      wrapper = shallow(<Header title="Hey Yo" titleHref="/hey-yo" />);
      container = wrapper.childAt(0).childAt(0);
    });

    it('sets no link to the title', () => {
      const title = container.childAt(0);
      const link = title.childAt(0);
      expect(link.prop('to')).toBe('/hey-yo');
    });
  });

  describe('menu', () => {
    beforeEach(() => {
      const menus: IHeaderMenu[] = [
        {
          links: [],
          name: 'Menu Group 1',
        },
      ];
      wrapper = shallow(<Header menus={menus} />);
      container = wrapper.childAt(0).childAt(0);
    });

    it('sets the specified menus', () => {
      const menus = container.childAt(1);
      expect(menus.prop('menus')).toEqual([
        {
          links: [],
          name: 'Menu Group 1',
        },
      ]);
    });
  });
});
