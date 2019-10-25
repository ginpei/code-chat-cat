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

  describe('deg2()', () => {
    it('fills 0', () => {
      expect(misc.deg2(0)).toBe('00');
      expect(misc.deg2(9)).toBe('09');
    });

    it('returns original 2 digits or more', () => {
      expect(misc.deg2(10)).toBe('10');
      expect(misc.deg2(99)).toBe('99');
    });

    it('throws if negative', () => {
      expect(() => {
        misc.deg2(-1);
      }).toThrow();
    });

    it('throws if exceeds the digits', () => {
      expect(() => {
        misc.deg2(100);
      }).toThrow();
    });
  });

  describe('getReadableElapse', () => {
    let now: number;
    let dateNow: jest.SpyInstance<number, []>;

    beforeEach(() => {
      // Note: TZ=America/Vancouver is expected

      dateNow = jest.spyOn(Date, 'now');
      dateNow.mockReturnValue(new Date('2000-01-23').getTime());
      now = Date.now();
    });

    afterEach(() => {
      dateNow.mockRestore();
    });

    it('returns if less than a minute', () => {
      expect(misc.getReadableElapse(now)).toBe('< 1 m');

      dateNow.mockReturnValue(now + 60 * 1000 - 1);
      expect(misc.getReadableElapse(now)).toBe('< 1 m');
    });

    it('returns in minutes', () => {
      dateNow.mockReturnValue(now + 60 * 1000);
      expect(misc.getReadableElapse(now)).toBe('1 m');

      dateNow.mockReturnValue(now + 60 * 60 * 1000 - 1);
      expect(misc.getReadableElapse(now)).toBe('59 m');
    });

    it('returns in hours', () => {
      dateNow.mockReturnValue(now + 60 * 60 * 1000);
      expect(misc.getReadableElapse(now)).toBe('1 h');

      dateNow.mockReturnValue(now + 24 * 60 * 60 * 1000 - 1);
      expect(misc.getReadableElapse(now)).toBe('23 h');
    });

    it('returns in days at most 3 days', () => {
      dateNow.mockReturnValue(now + 24 * 60 * 60 * 1000);
      expect(misc.getReadableElapse(now)).toBe('1 d');

      dateNow.mockReturnValue(now + 4 * 24 * 60 * 60 * 1000 - 1);
      expect(misc.getReadableElapse(now)).toBe('3 d');
    });

    it('returns in yyyy-MM-dd format', () => {
      dateNow.mockReturnValue(now + 4 * 24 * 60 * 60 * 1000);
      expect(misc.getReadableElapse(now)).toBe('2000-01-23');
    });
  });
});
