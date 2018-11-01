$(document).ready(function(){
  makeMap('containerparken', containerparken);
})
function makeMap(idMap, json){
  var map = L.map('map').setView([51.2088094,3.2244034], 9);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

addMarkers(map, json);

}

function addMarkers(map, json){
  for (var i = 0; i < json.length; i++) {
    L.marker([json[i].json_geometry.coordinates[1], json[i].json_geometry.coordinates[0]]).addTo(map);
  }
}
