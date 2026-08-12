function viewPassword(item) {
    var $inputPassword = $(item).siblings('input[type=password]');
    $(item)
        .hover(function () {
            $inputPassword.attr('type', 'text');
        }, function () {
            $inputPassword.attr('type', 'password');
        }
        ).click(function (e) { e.preventDefault(); });
}

function geolocationStart(formId) {

    if ("geolocation" in navigator) {

        navigator.geolocation.getCurrentPosition((position) => {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            localStorage.setItem('latitude', latitude);
            localStorage.setItem('longitude', longitude)
            var url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;
            $(`form#${formId}`).find('input#latitude').val(latitude);
            $(`form#${formId}`).find('input#longitude').val(longitude);

            if (localStorage.getItem('display_name_address') !== null) {

                $(`form#${formId}`)
                    .find('input#address')
                    .val(localStorage.getItem('display_name_address'));


            } else {

                $.get(url, function (data) {
                    //console.log(`Richiesta GET effettuata, risultato: ${data.display_name}`);
                    $(`form#${formId}`).find('input#address').val(data.display_name);
                    localStorage.setItem('display_name_address', data.display_name);
                    
                });

            }

        });
    } else {
        /* geolocation IS NOT available */
    }

}

$(document)
.ready(function(){

$('body')
.on('click', '#logout', function (e) 
{
    e.preventDefault();
    var currentpage = window.location.href;
    var settings = {
            "url": "/api/logout",
            "beforeSend": function(xhr){
                $('#divLoading').addClass('show');
                },
            "success": function(dati){         
                location.href = currentpage;                   
            },  
            "error": function(jqXHR, textStatus, errorThrown){
                $('#divLoading').removeClass('show');
                    
             },
            "complete": function(comp){
                $('#divLoading').removeClass('show');
                 },
            "method": "POST",
            "timeout": 0,
            };

  $.ajax(settings);

});




});