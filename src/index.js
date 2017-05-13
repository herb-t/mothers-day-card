import init from './app';

init();

TweenMax.staggerTo(
  '.top-greeting',
  1,
  { bottom: 0, opacity: 1, ease: Power2.easeOut },
  1
);
