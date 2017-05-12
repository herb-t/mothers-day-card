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
      loop: true
    });
    swiper;
  });
};

export default initSliders;
