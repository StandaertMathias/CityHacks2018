let route = [];
let stop = false;
let id = 0;
let map;
function startRunning() {
    id = window.setInterval(function () {
        if (!stop) {
            navigator.geolocation.getCurrentPosition(function (position) {
                route.push(
                    {
                        'x': position.coords.latitude,
                        'y': position.coords.longitude
                    });

            });
        } else {
            window.clearInterval(id);
            for(var i = 0; i<route.length; i++){
                addMarker(map, route[i].x, route[i].y, 'route');
            }
        }
    }, 1000);
}

$(document).ready(function () {
    // add code here
    getLocation();
    startRunning();
    $('#stop').on('click', function () {
        stop = true;
    })
});

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    map = L.map('map').setView([position.coords.latitude, position.coords.longitude], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    addMarker(map, position.coords.latitude, position.coords.longitude, "me")
}


function addMarker(map, x, y, type) {
    L.marker([x, y]).addTo(map);
}