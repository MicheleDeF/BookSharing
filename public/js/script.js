$(document)
.ready(function(){

// Verifica lo stato del permesso di geolocalizzazione
navigator.permissions.query({ name: 'geolocation' }).then(function(result) {
  if (result.state === 'denied') {
       $('body').find('div#alertSharePosition').removeClass('visually-hidden');

    } else {
     
     if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => { 
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        localStorage.setItem('latitude', latitude);
        localStorage.setItem('longitude', longitude);
        var url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;
         if (localStorage.getItem('display_name_address') === null) {
            $.get(url, function (data) {localStorage.setItem('display_name_address', data.display_name);});
         }
    }
    );
 }
}
});

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