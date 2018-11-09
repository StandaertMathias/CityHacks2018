$(document).ready(function(){
    // add code here
    getLocation();
});
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}
function showPosition(position) {
    var map = L.map('map').setView([position.coords.latitude,position.coords.longitude], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    addMarker(map, position.coords.latitude, position.coords.longitude, "me")
}


function addMarker(map, x,y, type){
        L.marker([x, y]).addTo(map);
}