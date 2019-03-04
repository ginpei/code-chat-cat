/**
 * Set scroll top by position ratio.
 * @param el The target scrolling element.
 * @param progress Scrolling position ratio from `0` to `1`.
 */
function scroll (el: Element, progress: number): Promise<void> {
  return new Promise<void>((resolve) => {
    const height = el.scrollHeight - el.clientHeight;
    const top = height * progress;

    // skip if it won't fire a scroll event
    const curTop = el.scrollTop;
    if (Math.abs(top - curTop) < 1) {
      resolve();
      return;
    }

    el.addEventListener('scroll', () => resolve(), { once: true });
    el.scrollTop = top;
  });
}

/**
 * Create a handler function which should be called when one of the target
 * event fires a `scroll` event.
 * @param els The target elements.
 */
function createHandler (els: Element[]) {
  function onScroll (event: Event) {
    const elTarget = event.currentTarget;
    if (!(elTarget instanceof Element)) {
      return Promise.resolve();
    }

    const top = elTarget.scrollTop;
    const height = elTarget.scrollHeight - elTarget.clientHeight;
    const progress = top / height;

    const waiting = els.map((el) => {
      if (el === elTarget) {
        return Promise.resolve();
      }

      return scroll(el, progress);
    });

    return Promise.all(waiting).then(() => undefined);
  }

  return onScroll;
}

/**
 * Set up elements to sync scrolling when each of them scrolls.
 * @param els The target element to sync scrolling.
 */
export default function syncScroll (els: Element[]) {
  let scrolling = false;
  const handleScrolling = createHandler(els);
  const listener = (event: Event) => {
    if (!scrolling) {
      scrolling = true;
      handleScrolling(event)
        .then(() => scrolling = false);
    }
  };

  els.forEach((node) => {
    node.addEventListener('scroll', listener);
  });

  const unsubscribe = () => {
    els.forEach((el) => el.removeEventListener('scroll', listener));
  };
  return unsubscribe;
}
