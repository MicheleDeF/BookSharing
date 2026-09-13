$(document)
.ready(function(){

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
const accept_cookies = document.cookie.indexOf('accept_cookies=');

if(accept_cookies == -1){
 $('#acceptCookies').modal('show');
}

$('#acceptCookies')
.find('#heconfirms')
.click(function (e) {
    e.preventDefault();
    const cname = "accept_cookies"; const cvalue = 1; const exdays = 1; const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    $('#acceptCookies').modal('hide');    
});

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
.on('click', 'returnTop', function(e){
   e.preventDefault();
    window.scrollTo({
      top: 0,         
      left: 0,       
      behavior: 'smooth'
    });
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