import { mount, ReactWrapper } from 'enzyme';
import React from 'react';
import syncScroll from './syncScroll';

describe('syncScroll()', () => {
  let wrapper: ReactWrapper;
  let el1: Element;
  let el2: Element;

  /**
   * Overwrite properties even if they are readonly.
   * @param obj
   * @param props
   */
  function setProps (obj: any, props: { [key: string]: any }) {
    Object.entries(props).forEach(([key, value]) => {
      Object.defineProperty(obj, key, { value, writable: true });
    });
  }

  /**
   * Fire event on the specified element.
   * @param el
   * @param type Event type. e.g. `'click'`, `'scroll'`
   * @param mock
   */
  function dispatchEvent (el: Element, type: string, mock: any = {}) {
    const event = new Event(type);
    setProps(event, mock);
    if (!('currentTarget' in mock)) {
      setProps(event, { currentTarget: el });
    }
    el.dispatchEvent(event);
  }

  beforeEach(() => {
    wrapper = mount((
      <div>
        <textarea id="el1" />
        <div id="el2"/>
      </div>
    ));

    el1 = wrapper.find('#el1').getDOMNode();
    el2 = wrapper.find('#el2').getDOMNode();
  });

  it('synchronizes scroll top values of both', () => {
    syncScroll([el1, el2]);

    // "1100px scroll height" - "100px client height" = "1000px scroll range"
    // "100px scroll top" / "1000px scroll range" = "0.1 progress"
    setProps(el1, {
      clientHeight: 100,
      scrollHeight: 1100,
      scrollTop: 100,
    });

    // make el2 have 500px scroll range
    // and set scroll top 0px
    setProps(el2, {
      clientHeight: 10,
      scrollHeight: 510,
      scrollTop: 0,
    });

    // fire the event. scroll top is set above
    dispatchEvent(el1, 'scroll');

    // the first scrolling on el1 should cause this scrolling on el2
    dispatchEvent(el2, 'scroll');

    // 0.1 progress of 500px range on el2 makes 50
    expect(el2.scrollTop).toBe(50);
  });

  it('returns unsubscriber', () => {
    const unsubscribe = syncScroll([el1, el2]);

    setProps(el1, { clientHeight: 100, scrollHeight: 1100, scrollTop: 100 });
    setProps(el2, { clientHeight: 10, scrollHeight: 510, scrollTop: 1 });

    unsubscribe();
    dispatchEvent(el1, 'scroll');

    expect(el2.scrollTop).toBe(1);
  });

  it('does not fail even if current target is null', () => {
    syncScroll([el1, el2]);

    setProps(el1, { clientHeight: 100, scrollHeight: 1100, scrollTop: 100 });
    setProps(el2, { clientHeight: 10, scrollHeight: 510, scrollTop: 1 });

    const f = () => dispatchEvent(el1, 'scroll', { currentTarget: null });
    expect(f).not.toThrow();
  });
});
