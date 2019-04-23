import { createBrowserHistory } from 'history';

export const noop: () => void = () => undefined;

export function sleep (ms: number) {
  return new Promise((f) => setTimeout(f, ms));
}

export const appHistory = createBrowserHistory();

// tslint:disable-next-line:ban-types
export function debounce<F extends Function> (fn: F, delay: number): F {
  let tm = 0;
  return function (this: any, ...args: any[]) {
    window.clearTimeout(tm);
    tm  = window.setTimeout(() => fn.apply(this, args), delay);
  } as any;
}
