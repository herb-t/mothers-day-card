import { createHeroEffect } from './ui/hero';
import {
  toggleClassOnVisible,
  createScrollTo,
  addTapListener
} from './ui/utils';
import { createModal } from './ui/modal';
import { createVideoModalPlayer } from './ui/video';
import { trackEvent } from './analytics';
import { requestIframeHeight } from './ui/form';

document.addEventListener('DOMContentLoaded', function() {
  const nodes = {};

  nodes.content = document.querySelector('#content');
  nodes.hero = document.querySelector('#hero');
  nodes.intro = document.querySelector('#intro');
  nodes.scroll = document.querySelector('#scroll');
  nodes.form = document.querySelector('#form');
  nodes.footer = document.querySelector('#footer');
  nodes.fixture = document.querySelector('#fixture');

  // request iframe height

  requestIframeHeight(nodes);

  // add scroll and mousemove animation to page hero

  createHeroEffect(nodes);

  // toggle visible class

  const toggleVisibleEls = document.querySelectorAll('[data-toggle-visible]');

  [ ...toggleVisibleEls ].map(el => toggleClassOnVisible(el));

  // scroll to form
  const scrollToEls = document.querySelectorAll('[data-scroll-to]');

  [ ...scrollToEls ].map(el => createScrollTo(el));

  // modals

  const modalEls = document.querySelectorAll('[data-modal]');

  [ ...modalEls ].map(el => createModal(el, nodes));

  // tracking

  const ctaEls = document.querySelectorAll('[data-cta]');

  [ ...ctaEls ].map(el =>
    addTapListener(el, () => {
      trackEvent('cta', 'click', el.getAttribute('data-cta'));
    })
  );

  // video player modal

  const video = document.querySelector('[data-video-id]');
  const modal = document.querySelector('[data-modal=video]');

  createVideoModalPlayer(video, modal);
});
