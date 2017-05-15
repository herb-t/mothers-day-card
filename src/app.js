import config from './config';
import initSliders from './sliders';
import animation from './animation';

let init = () => {
  var _preloadImages =
    _preloadImages ||
    function(a, d, z) {
      a instanceof Array || (a = [ a ]);
      for (var e = a.length, f = 0, g = e; g--; ) {
        var b = document.createElement('img');
        b.onload = function() {
          f++;
          f >= e && isFunction(d) && d(z);
        };
        b.src = a[g];
      }
    };

  var isFunction =
    isFunction ||
    function(functionToCheck) {
      var getType = {};
      return (
        functionToCheck &&
        getType.toString.call(functionToCheck) == '[object Function]'
      );
    };

  _preloadImages(config.manifest, _imagesAreLoaded);

  function _imagesAreLoaded() {
    console.log('Happy Mothers Day');
    TweenMax.to('.loading-overlay', 0.5, {
      opacity: 0,
      zIndex: 0,
      onComplete: () => animation.play()
    });
  }

  initSliders();
};

export default init;
