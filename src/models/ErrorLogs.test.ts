import { noop } from '../misc';
import * as ErrorLogs from './ErrorLogs';

describe('ErrorLogs', () => {
  let error: ErrorLogs.AppError;
  let state: ErrorLogs.IErrorLog[];
  let result: ErrorLogs.IErrorLog[];
  let consoleError: jest.SpyInstance;

  beforeEach(() => {
    consoleError = jest.spyOn(console, 'error')
      .mockImplementation(noop);

    error = new Error('This is test');
    state = [];
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('add', () => {
    beforeEach(() => {
      const action = ErrorLogs.add('test case', error);
      result = ErrorLogs.reduceErrorLogs(state, action);
    });

    it('returns new state', () => {
      expect(result).not.toBe(state);
    });

    it('renders the error in console', () => {
      expect(consoleError).toHaveBeenCalledWith('[test case]', error);
    });

    it('stores the time when occurred', () => {
      expect(result[0].error).toBe(error);
    });
  });

  describe('clear', () => {
    beforeEach(() => {
      const action = ErrorLogs.clear();
      result = ErrorLogs.reduceErrorLogs(state, action);
    });

    it('returns new state', () => {
      expect(result).not.toBe(state);
    });

    it('now stores none', () => {
      expect(result).toHaveLength(0);
    });
  });
});
