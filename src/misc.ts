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

let tmResetTitle = 0;

export function resetTitle () {
  tmResetTitle = window.setTimeout(() => setTitle(), 100);
}

export function setTitle (...titles: string[]) {
  clearTimeout(tmResetTitle);

  const appName = 'Code Chat Cat';
  const fullTitle = [...titles, appName].join(' - ');
  document.title = fullTitle;
}

export function deg2 (n: number) {
  if (n < 0) {
    throw new Error('Number must be positive');
  }

  if (n >= 10 ** 2) {
    throw new Error('Number must not exceed 2 digits');
  }

  return `0${n}`.slice(-2);
}

export function getReadableElapse (time: number) {
  const elapse = Date.now() - time;

  const min = 60 * 1000;
  if (elapse < min) {
    return '< 1 m';
  }

  const hour = 60 * min;
  if (elapse < hour) {
    return `${Math.floor(elapse / min)} m`;
  }

  const day = 24 * hour;
  if (elapse < day) {
    return `${Math.floor(elapse / hour)} h`;
  }

  const day4 = 4 * day;
  if (elapse < day4) {
    return `${Math.floor(elapse / day)} d`;
  }

  const date = new Date(time);
  const yyyy = date.getFullYear();
  const MM = deg2(date.getMonth() + 1);
  const dd = deg2(date.getDate() + 1);
  return `${yyyy}-${MM}-${dd}`;
}
