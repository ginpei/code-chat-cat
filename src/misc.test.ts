import * as misc from './misc';

describe('misc', () => {
  describe('debounce', () => {
    let spy: jest.Mock;
    let context: {};

    beforeEach(() => {
      jest.useFakeTimers();
      spy = jest.fn();
      context = {};

      const f = misc.debounce(spy, 100);
      f(11, 22);
      f(33, 44);
      f.call(context, 55, 66);
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    describe('just after call', () => {
      it('does not run immediately', () => {
        expect(spy).not.toBeCalled();
      });
    });

    describe('after the elapse', () => {
      beforeEach(() => {
        jest.advanceTimersByTime(100);
      });

      it('runs only once after interval', () => {
        expect(spy).toBeCalledTimes(1);
      });

      it('passes last parameters', () => {
        expect(spy).not.toBeCalledWith(11, 22);
        expect(spy).toBeCalledWith(55, 66);
      });

      it('respects context', () => {
        expect(spy.mock.instances[0]).toBe(context);
      });
    });
  });
});
