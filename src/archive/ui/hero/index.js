import { isMobile, addResizeListener, addScrollListener } from '../../ui/utils';

let videoVisible = false;
let videoPlayed = false;

// Resize the fixture height to full document height minus viewport

function resizeFixture(fixture, intro, form, footer) {
  addResizeListener(() => {
    const height =
      intro.offsetHeight +
      form.offsetHeight +
      footer.offsetHeight +
      window.innerHeight * 0.01;
    TweenMax.set(fixture, { height });
  });
}

// Offset intro to bring it in line with the scroll fixture

function offsetIntro(heroVideo, introBlock) {
  addScrollListener(() => {
    const pageYOffset = window.pageYOffset;
    const y = Math.min(pageYOffset / 2, 280);

    if (!videoPlayed || !videoVisible) {
      TweenMax.set(introBlock, { y, force3D: true });
    }
  });
}

// Scale hero background container on scroll

function scaleBackground(heroBackground) {
  addScrollListener(() => {
    const pageYOffset = window.pageYOffset;
    const innerHeight = window.innerHeight;
    const scale = Math.max((1 - pageYOffset / innerHeight) * 0.1 + 1, 1);
    TweenMax.set(heroBackground, { scale, force3D: true });
  });
}

// Fade in/out video on playback

function autoplayVideo(heroVideo, introBlock) {
  function fadeIn() {
    const tl = new TimelineMax();

    tl.to(introBlock, 0.8, { y: 280, ease: Power2.easeOut });
    tl.fromTo(
      heroVideo,
      0.8,
      { autoAlpha: 0 },
      {
        autoAlpha: 1,
        display: 'block',
        ease: Power2.easeOut
      },
      0.0
    );

    videoVisible = true;
  }

  function fadeOut() {
    const tl = new TimelineMax();
    const y = Math.min(window.pageYOffset / 2, 280);

    tl.to(introBlock, 0.4, { y, ease: Power2.easeOut });
    tl.to(
      heroVideo,
      0.4,
      {
        autoAlpha: 0,
        display: 'none',
        ease: Power2.easeOut
      },
      0.0
    );

    videoVisible = false;
  }

  function playVideo() {
    heroVideo.play();
  }

  function stopVideo() {
    clearTimeout(heroTimeout);
    heroVideo.pause();
    fadeOut();
  }

  // play after 2 seconds
  let heroTimeout = setTimeout(playVideo, 2000);

  // fade out when close to end
  heroVideo.addEventListener('playing', () => {
    if (!videoPlayed) videoPlayed = true;
    if (!videoVisible) fadeIn();

    if (heroVideo.duration - heroVideo.currentTime < 0.4) fadeOut();
  });

  // fade out if video stops
  heroVideo.addEventListener('ended', fadeOut);
  heroVideo.addEventListener('pause', fadeOut);

  // pause on modal open
  document.body.addEventListener('modal-open', stopVideo);

  // stop video on scroll
  if (window.pageYOffset / window.innerHeight < 0.5) {
    const pageYOffset = window.pageYOffset;
    const removeListener = addScrollListener(() => {
      const scrollDelta = window.pageYOffset - pageYOffset;
      if (Math.abs(scrollDelta) > 10) {
        stopVideo();
        removeListener();
      }
    });
  }
}

export function createHeroEffect({ hero, intro, form, footer, fixture }) {
  const heroBackground = hero.querySelector('.hero__background');
  const heroVideo = hero.querySelector('.hero__video video');
  const introBlock = intro.querySelector('.block');

  resizeFixture(fixture, intro, form, footer);
  offsetIntro(heroVideo, introBlock);
  autoplayVideo(heroVideo, introBlock);
  if (!isMobile()) {
    scaleBackground(heroBackground);
  }
}
