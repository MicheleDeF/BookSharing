$(document).ready(function(){

    /** Questo è l'evento 'submit' associato al modulo web nella home page per visualizzare dati sulla mappa. */
    $('body')
        .on('submit', 'form#bookSearch', function (e) {
            e.preventDefault();
            var $form = $(this);
            let category = $form.find('select#category').val();
            let lat = localStorage.getItem('latitude');
            let lon = localStorage.getItem('longitude');
            window.location.href = `/view-map?category=${category}&lat=${lat}&lon=${lon}`;
        });

});

/** Mostra i libri nelle vicinanze inseriti di recente, 
 *  Carousel di immagini generato con swiperjs (https://swiperjs.com/get-started)
 */
const swiper = new Swiper('.latest_books', {

  slidesPerView: 1,
  spaceBetween: 20,
  loop: true,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  breakpoints: {
    576: {
      slidesPerView: 2,
      spaceBetween: 20
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 24
    },
    992: {
      slidesPerView: 4,
      spaceBetween: 24
    }
  }
});