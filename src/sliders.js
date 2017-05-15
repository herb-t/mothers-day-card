let initSliders = () => {
  _setUpSliders();
};

let _setUpSliders = () => {

  let sliders = Array.prototype.slice.call(
    document.querySelectorAll('.swiper-container')
  );

  sliders.forEach(function(element) {
    let swiper = new Swiper(element, {
      nextButton: '.swiper-button-next',
      prevButton: '.swiper-button-prev',
      slidesPerView: 1,
      loop: true,
      autoplay: (getRandomInt(3, 13) * 1000)
    });
    swiper;
  });

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

};

export default initSliders;
