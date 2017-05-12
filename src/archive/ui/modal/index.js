import CustomEvent from 'custom-event';
import { trackEvent } from '../../analytics';
import {
  addTapListener,
  addKeyUpListener,
  addResizeListener,
  blockUI
} from '../utils';

const modals = new Map();

let cancelResizeListener = null;
let cancelKeyUpListener = null;

export function createModal(modal, { content }) {
  const name = modal.getAttribute('data-modal');
  modals.set(name, modal);

  // content
  const modalContent = modal.querySelector('.modal__content');

  // close

  const closeEls = modal.querySelectorAll('[data-modal-close]');

  [ ...closeEls ].map(el => addTapListener(el, closeModal));

  // open

  const openEls = document.querySelectorAll(`[data-modal-open=${name}]`);

  [ ...openEls ].map(el => addTapListener(el, openModal));

  // focus

  const focusEl = modal.querySelector('[data-modal-focus]');

  // show

  function openModal(e) {
    e.preventDefault();

    // hide all modals
    modals.forEach(modal => modal.removeAttribute('data-open'));

    // show this modal
    document.body.setAttribute('data-open', '');
    modal.setAttribute('data-open', '');
    content.setAttribute('data-open', '');
    content.setAttribute('tabindex', '-1');

    // scroll to top
    if (modalContent) modalContent.scrollTop = 0;

    // set focus within modal
    if (focusEl) focusEl.focus();

    // listeners
    cancelKeyUpListener = addKeyUpListener(closeModal, { key: 'Escape' });
    cancelResizeListener = addResizeListener(resizeElements);
    resizeElements();

    // events ftw
    modal.dispatchEvent(new CustomEvent('modal-open', { bubbles: true }));

    // tracking
    trackEvent('cta', 'click', `${name}`);
  }

  // hide

  function closeModal(e) {
    blockUI(300);
    e.preventDefault();

    // events ftw
    modal.dispatchEvent(new CustomEvent('modal-close', { bubbles: true }));

    // clear focus within modal
    if (focusEl) focusEl.blur();

    // cancel listeners
    if (cancelKeyUpListener) cancelKeyUpListener();
    if (cancelResizeListener) cancelResizeListener();

    // hide this modal
    document.body.removeAttribute('data-open');
    modal.removeAttribute('data-open');
    content.removeAttribute('data-open');
    content.removeAttribute('tabindex');
    content.removeAttribute('style');

    // tracking
    trackEvent('cta', 'click', `${name} close`);
  }

  function resizeElements() {
    const { innerHeight, innerWidth } = window;
    if (content) {
      const maxHeight = innerWidth <= 768
        ? `${innerHeight}px`
        : `${innerHeight}px`;
      content.setAttribute('style', `max-height: ${maxHeight}`);
    }
    if (focusEl) {
      const maxHeight = innerWidth <= 768
        ? `${innerHeight - 60}px`
        : `${innerHeight - 120}px`;
      focusEl.setAttribute('style', `max-height: ${maxHeight}`);
    }
  }
}
