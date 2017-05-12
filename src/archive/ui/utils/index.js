import is from 'is_js';
import 'pepjs';

export const isMobile = () => is.mobile() || is.tablet();

// Listen for scroll & content/window resizing events.
// Return a function to remove listeners

let scrollSet = new Set();
const scrollListener = e => scrollSet.forEach(fn => fn(e));

export function addScrollListener(callback) {
  scrollSet.add(callback);

  if (scrollSet.size === 1) {
    window.addEventListener('DOMContentLoaded', scrollListener, false);
    window.addEventListener('load', scrollListener, false);
    window.addEventListener('resize', scrollListener, false);
    window.addEventListener('scroll', scrollListener, false);
    window.addEventListener('wheel', scrollListener, false);
  }

  return () => removeScrollListener(callback);
}

function removeScrollListener(callback) {
  scrollSet.delete(callback);

  if (scrollSet.size === 0) {
    window.removeEventListener('DOMContentLoaded', scrollListener, false);
    window.removeEventListener('load', scrollListener, false);
    window.removeEventListener('resize', scrollListener, false);
    window.removeEventListener('scroll', scrollListener, false);
    window.removeEventListener('wheel', scrollListener, false);
  }
}

// Listen for just resizing events

let resizeSet = new Set();
const resizeListener = e => resizeSet.forEach(fn => fn(e));

export function addResizeListener(callback) {
  resizeSet.add(callback);

  if (resizeSet.size === 1) {
    window.addEventListener('DOMContentLoaded', resizeListener, false);
    window.addEventListener('load', resizeListener, false);
    window.addEventListener('resize', resizeListener, false);
  }

  return () => removeResizeListener(callback);
}

function removeResizeListener(callback) {
  resizeSet.delete(callback);

  if (resizeSet.size === 0) {
    window.removeEventListener('DOMContentLoaded', resizeListener, false);
    window.removeEventListener('load', resizeListener, false);
    window.removeEventListener('resize', resizeListener, false);
  }
}

// When an element scrolls into the viewport, add a visible class.
// When it scrolls out of view, remove the class.

const elements = [];

function checkVisibility(el) {
  const { top, left, bottom, right } = el.getBoundingClientRect();
  const factor = 1 / 8;
  const visible =
    bottom - (bottom - top) * factor >= 0 &&
    right - (right - left) * factor >= 0 &&
    top + (bottom - top) * factor <= window.innerHeight &&
    left + (right - left) * factor <= window.innerWidth;

  return visible;
}

function onScroll() {
  elements.map(({ el, className }) => {
    if (checkVisibility(el)) {
      if (!el.classList.contains(className)) {
        el.classList.add(className);
      }
    } else {
      if (el.classList.contains(className)) {
        el.classList.remove(className);
      }
    }
  });
}

export function toggleClassOnVisible(el, className = 'visible') {
  // on mobile devices, assume visibility because scroll events don't
  // bubble from iframe
  if (isMobile()) {
    el.classList.add(className);
  } else {
    if (elements.length === 0) addScrollListener(onScroll);
    elements.push({ el, className });
  }
}

// Uses Pointer Events Polyfill
// https://github.com/jquery/PEP

export function addTapListener(el, callback) {
  el.addEventListener('pointerdown', callback, false);

  return () => removeTapListener(el, callback);
}

function removeTapListener(el, callback) {
  el.removeEventListener('pointerdown', callback, false);
}

// Listen for the specified key

export function addKeyUpListener(callback, { key }) {
  function onKeyUp(event) {
    if (event.key === key) {
      callback(event);
    }
  }

  window.addEventListener('keyup', onKeyUp);

  return () => removeKeyUpListener(onKeyUp);
}

function removeKeyUpListener(callback) {
  window.removeEventListener('keyup', callback);
}

// Scroll to the target specified in the data-scroll-to attr

export function createScrollTo(el) {
  function scrollTo(e) {
    e.preventDefault();

    const { top } = target.getBoundingClientRect();
    const y = top + window.pageYOffset;

    TweenMax.to(window, 0.25, { scrollTo: { y }, ease: Power2.easeOut });
  }

  const selector = el.getAttribute('data-scroll-to');
  const target = document.querySelector(selector);

  addTapListener(el, scrollTo);
}

// prevent interaction for some duration

export function blockUI(t = 500) {
  function onClick(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  const names = [
    'click',
    'mousedown',
    'mouseup',
    'pointerdown',
    'pointerup',
    'touchstart',
    'touchened'
  ];

  document.body.setAttribute('data-block-ui', '');
  names.map(name => document.addEventListener(name, onClick, true));

  setTimeout(() => {
    document.body.removeAttribute('data-block-ui');
    names.map(name => document.removeEventListener(name, onClick, true));
  }, t);
}
