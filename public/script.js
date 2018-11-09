let route = [];
let stop = false;
let id = 0;
let map;
let photos;

function startRunning() {
    id = window.setInterval(function () {
        if (!stop) {
            navigator.geolocation.getCurrentPosition(function (position) {
                route.push(
                    {
                        'x': position.coords.latitude,
                        'y': position.coords.longitude
                    });
                addMarker(map, position.coords.latitude, position.coords.longitude, 'route');
            });
        } else {
            $('#submit').removeClass('hidden');
            window.clearInterval(id);
            console.log("stop")
            for (var i = 0; i < route.length; i++) {
                addMarker(map, route[i].x, route[i].y, 'route');
            }
            $('#take-picture').removeClass('hidden');
        }
    }, 1000);
}


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

function readURL(input) {
    let url = "";
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#resultImage').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
        console.log('hieer1');
        window.setTimeout(combineImages, 1000);
    }
}

function combineImages() {
    console.log('hieer2');
    console.log($('#resultImage').attr('src'));
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    var imageObj1 = new Image();
    var imageObj2 = new Image();
    var imageObj3 = new Image();
    imageObj1.src = $('#resultImage').attr('src');
    imageObj1.onload = function () {
        ctx.drawImage(imageObj1, 0, 0, 500, 500);
        imageObj2.src = "/images/brugge.jpg";
        imageObj2.onload = function () {
            ctx.drawImage(imageObj2, 0, 0, 50, 50);
            var link = document.createElement("a");
            link.download = "Yield_Map.png";
            link.href = c.toDataURL('image/png');
            link.click();
        }
    }

}

$(document).ready(function () {
    // add code here
    getLocation();
    startRunning();
    $('#stop').on('click', function () {
        stop = true;
    });

    $("#take-picture").change(function () {
        readURL(this);
    });
});