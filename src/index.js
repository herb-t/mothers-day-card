import init from './app';

init();

TweenMax.to('.personal', 0.75, {
  delay: 1,
  bottom: 0,
  opacity: 1,
  ease: Power2.easeOut
});
