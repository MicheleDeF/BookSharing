$(document).ready(function(){

    $('body')
        .on('submit', 'form#bookSearch', function (e) {
            e.preventDefault();
            var $form = $(this);
            let category = $form.find('select#category').val();
            let lat = localStorage.getItem('latitude');
            let lon = localStorage.getItem('longitude');
            window.location.href = `/view-map?category=${category}&lat=${lat}&lon=${lon}`;
        })

});