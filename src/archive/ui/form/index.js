import CustomEvent from 'custom-event';

const ORIGINS_PROD = 'https://esgus2.etribez.com';
// const ORIGINS_PROD = 'http://localhost:3000';

const PAIR_WINDOWS = 'PAIR_WINDOWS';
const SYNC_HEIGHT = 'SYNC_HEIGHT';
const PAGE_CHANGE = 'PAGE_CHANGE';

export function requestIframeHeight({ form }) {
  const iframe = form.querySelector('#etribez');
  const counter = new Map();

  if (!iframe) return;

  function onMessage(e) {
    const origin = e.origin || e.originalEvent.origin;
    const isAllowed = origin === ORIGINS_PROD;

    if (!isAllowed) return;

    const { type, data } = e.data;

    const count = counter.has(type) ? counter.get(type) : 0;
    counter.set(type, count + 1);

    switch (type) {
      case PAIR_WINDOWS:
        pairWindows();
        break;
      case SYNC_HEIGHT:
        syncHeight(data.contentHeight);
        break;
      case PAGE_CHANGE:
        if (counter.get(PAGE_CHANGE) > 1) scrollToIframe();
        break;
    }
  }

  function scrollToIframe() {
    const { top } = iframe.getBoundingClientRect();
    const y = top + window.pageYOffset;

    TweenMax.to(window, 0.25, { scrollTo: { y }, ease: Power2.easeOut });
  }

  function pairWindows() {
    const target = iframe.contentWindow;
    const message = { type: PAIR_WINDOWS };
    target.postMessage(message, ORIGINS_PROD);
  }

  const syncHeight = (function() {
    let contentHeight = 0;
    let timeout = null;

    function setHeight() {
      iframe.setAttribute('scrolling', 'no');
      iframe.setAttribute('style', `height: ${contentHeight}px;`);
      // trigger any page resize code after resizing the iframe
      window.dispatchEvent(new CustomEvent('resize'));
    }

    return height => {
      contentHeight = height;
      clearTimeout(timeout);
      timeout = setTimeout(setHeight, 32);
    };
  })();

  if (window === window.parent) {
    window.addEventListener('message', onMessage, false);
  }
}
