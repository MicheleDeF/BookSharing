$(document).ready(function(){

/*var map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const myIcon = L.icon({
   iconUrl: '/images/marker-icon.png',
});

L.marker([[51.5, -0.09], {icon: myIcon}).addTo(map)
    .bindPopup('A pretty CSS popup.<br> Easily customizable.')
    .openPopup();
*/

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

if(categoryParam !== null && latParam !== null && lonParam !== null){
  var settings = {
    "url": `/api/map/?category=${categoryParam}&lat=${latParam}&lon=${lonParam}`,
    "method": "GET",
    "timeout": 0,
  };

  try {

    $.ajax(settings).done(function (response) {

      for (let index = 0; index < response.books.length; index++) {
        const element = response.books[index];
        let loc = ["LOCATION_" + index, element.lat, element.lon];
        locations.push(loc);
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

      for (var i = 0; i < locations.length; i++) {
        marker = new L.marker([locations[i][1], locations[i][2]])
          .bindPopup('A pretty CSS popup.<br> Easily customizable.')
          .addTo(map);
      }
    });

    
  } catch (error) {
    
  }




}else{


}













});