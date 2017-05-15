var preloadImages =
  preloadImages ||
  function(a, d, z) {
    console.log('init');

    a instanceof Array || (a = [ a ]);
    for (var e = a.length, f = 0, g = e; g--; ) {
      var b = document.createElement('img');
      b.onload = function() {
        f++;
        f >= e && isFunction(d) && d(z);
      };
      b.src = a[g];
    }

    var isFunction =
      isFunction ||
      function(functionToCheck) {
        let getType = {};

        return (
          functionToCheck &&
          getType.toString.call(functionToCheck) == '[ object Function ]'
        );
      };
  };

// preloadImages([
//   '../images/logo.png',
//   '../images/facebook-share-image_1200x630.png',
//   '../images/twitter-share_1024x512.png'
// ], function() {
//   console.log('images are loadedz');
// });

// // function _imagesAreLoaded() {
// //  console.log('images are loadedz');
// // }

export default preloadImages;
