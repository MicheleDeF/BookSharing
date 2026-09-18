$(document).ready(function(){

var locations = [];

const urlParams = new URLSearchParams(window.location.search);
const categoryParam = urlParams.get('category');
const latParam = urlParams.get('lat');
const lonParam = urlParams.get('lon');
var apiUrl = null;

  if (categoryParam !== null && latParam !== null && lonParam !== null) {
    apiUrl = `/api/map/?category=${categoryParam}&lat=${latParam}&lon=${lonParam}`;
  }
  else if (latParam !== null && lonParam !== null) {
    apiUrl = `/api/map/?lat=${latParam}&lon=${lonParam}`;
  }

  if(apiUrl == null){
    window.location.href="/404";
    return;
  }

  var settings = {
    "url": `${apiUrl}`,
    "method": "GET",
    "timeout": 0,
    "statusCode": {
      404: function() {window.location.href="/404";}
    }
  };

  try {

    $.ajax(settings).done(function (response) {

      if(response.books.length > 0){

        for (let index = 0; index < response.books.length; index++) {
            const element = response.books[index];
            
            let loc = [
                        "LOCATION_" + index, 
                        element.lat, 
                        element.lon, 
                        element.category, 
                        element.cover,
                        element.description,
                        Number.parseFloat(element.distance).toFixed(2),
                        element.title,
                        element.slug,
                        element.id,
                        element.user.avatar,
                        element.user.lastName,
                        element.user.firstName,
                        element.user.description
                      ];
            
            locations.push(loc);
          }
    }


      var map = L.map('map').setView([latParam, lonParam], 15);

      L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 18,
        }).addTo(map);

      const circle = L.circle([latParam, lonParam], {
        color: '#0d6efd',
        fillColor: '#0d6efd',
        fillOpacity: 0.15,
        radius: 500
      }).addTo(map);

      if(response.books.length > 0){
        const markersCluster = L.markerClusterGroup();
        for (var i = 0; i < locations.length; i++) {
           var marker = new L.marker([locations[i][1], locations[i][2]])
           .bindPopup(`<div class="book-popup-container"><div class="book-main-info"><img src="${locations[i][4]}" class="book-cover"><div class="book-details"><div><h3 class="book-title"><a href="/book/${locations[i][9]}/${locations[i][8]}" class="link-offset-2 link-underline link-underline-opacity-0">${locations[i][7]}</a></h3><span class="book-genre">${locations[i][3]}</span></div><span class="book-distance"><i class="fa-solid fa-location-dot"></i>${locations[i][6]} metri da te</span></div></div><hr class="popup-divider"><div class="book-owner-info"><img src="${locations[i][10]}" class="owner-avatar"><div class="owner-details"><span class="owner-label">Proprietario</span><span class="owner-name">${locations[i][12]} ${locations[i][11]}</span></div></div></div>`)
           .addTo(map);
           markersCluster.addLayer(marker);
       }

       map.addLayer(markersCluster);
    }
});

} catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Si è verificato un errore!",
      confirmButtonText: 'Chiudi'
    });  
  }
});