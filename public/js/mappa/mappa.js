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

var locations = [
  ["LOCATION_1", 11.8166, 122.0942],
  ["LOCATION_2", 11.9804, 121.9189],
  ["LOCATION_3", 10.7202, 122.5621],
  ["LOCATION_4", 11.3889, 122.6277],
  ["LOCATION_5", 10.5929, 122.6325]
];

var map = L.map('map').setView([11.206051, 122.447886], 8);

L.tileLayer(
  'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
  {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18,
  }).addTo(map);

for (var i = 0; i < locations.length; i++) 
{
  marker = new L.marker([locations[i][1], locations[i][2]])
                .bindPopup('A pretty CSS popup.<br> Easily customizable.')
                .addTo(map);
}

});