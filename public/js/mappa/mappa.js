$(document).ready(function(){

/* variabile locations
 var locations = [
  ["LOCATION_1", 11.8166, 122.0942],   
  ["LOCATION_2", 11.9804, 121.9189],
  ["LOCATION_3", 10.7202, 122.5621],
  ["LOCATION_4", 11.3889, 122.6277],
  ["LOCATION_5", 10.5929, 122.6325]
]; */

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

        for (var i = 0; i < locations.length; i++) {
           marker = new L.marker([locations[i][1], locations[i][2]])
          .bindPopup(`<div class="card mb-3" style="max-width: 540px;"><div class="row g-0"><div class="col-md-4"><img src="${locations[i][4]}" class="img-fluid rounded-start"></div><div class="col-md-8"><div class="card-body"><h6 class="card-title fs-6"><a href="/book/${locations[i][9]}/${locations[i][8]}" class="link-offset-2 link-underline link-underline-opacity-0">${locations[i][7]}</a></h6><cite>Genere: ${locations[i][3]}</cite><br/><cite>Distanza ${locations[i][6]} metri</cite></div></div></div><div class="row g-0"><div class="col-md-12"><cite><br/><i class="fa-solid fa-circle-info"></i> Questo libro è di:</cite></div></div><div class="row g-0"><div class="col-md-4"><img src="${locations[i][10]}" class="img-fluid rounded-start"></div><div class="col-md-8"><div class="card-body"><h6 class="card-title">${locations[i][12]} ${locations[i][11]}</h6><span class="card-text"><cite>${truncate(locations[i][13])}</cite></span></div></div></div></div>`)
          .addTo(map);
       }
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