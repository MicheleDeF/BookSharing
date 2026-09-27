function truncate(text, limit = 50) {
    if (text.length > limit) {
        return text.slice(0, limit) + '...';
    }
    return text;
 }

$(document)
.ready(function(){
/** Tooltip Bootstrap */
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
const accept_cookies = document.cookie.indexOf('accept_cookies=');

if(accept_cookies == -1){
  Swal.fire({
    title: 'Cookies & Privacy',
    html: `Questo sito web utilizza i cookie per garantirti la migliore esperienza sul nostro sito.<br/><br/><a href="/cookie-policy">Per saperne di più</a>`,
    icon: "info",
    confirmButtonText: 'Conferma' 
  }).then((result) => {  
    if(result.isConfirmed == true){
      const cname = "accept_cookies"; const cvalue = 1; const exdays = 1; const d = new Date();
      d.setTime(d.getTime() + (exdays*24*60*60*1000));
      let expires = "expires="+ d.toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
      window.location.reload();
    }
  
  }); 
}

setTimeout(()=>{
// Verifica lo stato del permesso di geolocalizzazione
  navigator.permissions.query({ name: 'geolocation' }).then(function (result) {
    if (result.state === 'denied') {
      $('body').find('div#alertSharePosition').removeClass('visually-hidden');

    } else {

      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          /** Decommentare le due righe 50,51 per ottenere la posizione esatta,
           *  commentare 52,53 per non usare i dati di test
           */
          /** Coordinate per dati di test >> */
          if (localStorage.getItem('latitude') && localStorage.getItem('longitude')) {
            var latitude = localStorage.getItem('latitude');
            var longitude = localStorage.getItem('longitude');
          } else {
            // var latitude = position.coords.latitude;
            // var longitude = position.coords.longitude;
            var latitude = 40.949282740897054;
            var longitude = 14.523030645794485;
          }
          /** << Coordinate per dati di test  */

          localStorage.setItem('latitude', latitude);
          localStorage.setItem('longitude', longitude);
          document.cookie = `latitude=${latitude}`;
          document.cookie = `longitude=${longitude}`;
          var url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;
          if (localStorage.getItem('display_name_address') === null) {
            $.get(url, function (data) {
              /** Decommentare la seguente riga per ottenere l'indirizzo esatto */
              localStorage.setItem('display_name_address', data.display_name);
              /** Indirizzo per dati di test */
            });
          }
        }
        );
      }
    }
  });
}, 4000);

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
.on('click', '#view-map', function(event){
  event.preventDefault();
  let lat = localStorage.getItem('latitude');
  let lon = localStorage.getItem('longitude');
  if(!lat || !lon){

    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Non hai condiviso la tua posizone! Non possiamo mostrarti contenuti vicino a te",   
      confirmButtonText: 'Chiudi'    
    });

  }else{      
    window.location.href = `/view-map?lat=${lat}&lon=${lon}`;
  }
});


$('body')
.on('click', '#logout', function (e) 
{
    e.preventDefault();
    var currentpage = "/";
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