let animation = new TimelineMax({ paused: true });

animation.to('.greeting-main--1', 0.75, {
  x: 0,
  opacity: 1,
  ease: Power2.easeOut
});
animation.staggerTo(
  '.top-greeting',
  0.75,
  { y: 0, opacity: 1, ease: Power4.easeOut },
  0.125,
  '+=0.25'
);
animation.to(
  '.greeting-main--2',
  0.75,
  { scale: 1, opacity: 1, ease: Back.easeOut },
  2
);
animation.to(
  '.greeting-main--3',
  0.75,
  { scale: 1, opacity: 1, ease: Back.easeOut },
  2.25
);
animation.to(
  '.greeting-main--4',
  0.75,
  { scale: 1, opacity: 1, ease: Back.easeOut },
  2.5
);
animation.to(
  '.greeting-main--5',
  0.75,
  { scale: 1, opacity: 1, ease: Back.easeOut },
  2.75
);
animation.to(
  '.greeting-main--6',
  0.75,
  { scale: 1, opacity: 1, ease: Back.easeOut },
  3
);
animation.staggerTo(
  '.personal-anim',
  0.75,
  { y: 0, opacity: 1, ease: Back.easeOut },
  0.15,
  '+=0.05'
);
animation.to('.body-swap', 0.5, { opacity: 1 }, 4.75);

export default animation;
