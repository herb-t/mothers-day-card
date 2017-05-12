import { trackEvent } from '../../analytics';

const apiReady = new Promise(resolve => {
  const tag = document.createElement('script');
  const firstScriptTag = document.getElementsByTagName('script')[0];

  tag.src = 'https://www.youtube.com/iframe_api';
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  window.onYouTubeIframeAPIReady = resolve;
});

export function createVideoModalPlayer(video, modal) {
  const height = video.getAttribute('data-height');
  const width = video.getAttribute('data-width');
  const videoId = video.getAttribute('data-video-id');

  return apiReady.then(function() {
    const player = new YT.Player(video, {
      height: height,
      width: width,
      videoId: videoId
    });

    // tracking
    const track = {
      interval: null,

      progress() {
        const time = player.getCurrentTime();
        const total = player.getDuration();
        const progress = Math.round(100 * time / total);

        if (progress % 25 === 0) {
          trackEvent('video', `progress ${progress}%`);
          if (progress === 100) {
            clearInterval(this.interval);
          }
        }
      },

      play() {
        this.interval = setInterval(this.progress, 500);
        trackEvent('video', 'play');
      },

      pause() {
        clearInterval(this.interval);
        trackEvent('video', 'pause');
      },

      end() {
        clearInterval(this.interval);
        trackEvent('video', 'end');
      }
    };

    player.addEventListener('onStateChange', ({ data }) => {
      switch (data) {
        case YT.PlayerState.PLAYING:
          track.play();
          break;
        case YT.PlayerState.PAUSED:
          track.pause();
          break;
        case YT.PlayerState.ENDED:
          track.end();
          break;
      }
    });

    // link up modal events
    player.addEventListener('onReady', () => {
      trackEvent('video', 'load');

      modal.addEventListener('modal-open', () => player.playVideo());
      modal.addEventListener('modal-close', () => {
        if (player.getPlayerState() === YT.PlayerState.PLAYING) {
          player.stopVideo();
          track.pause();
        }
      });
      if (modal.hasAttribute('data-open')) {
        player.playVideo();
      }
    });
  });
}
