export default function syncScroll (els: Element[]) {
  let scrolling = false;
  const handleScrolling = createHandler(els);
  const listener = async (event: Event) => {
    if (!scrolling) {
      scrolling = true;
      await handleScrolling(event);
      scrolling = false;
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

function createHandler (els: Element[]) {
  return async (event: Event) => {
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
    // waiting.push(new Promise((f) => setTimeout(f, 100)));

    return Promise.all(waiting).then(() => undefined);
  };
}

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
