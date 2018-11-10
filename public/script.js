let route = [];
let stop = false;
let id = 0;
let map;
let challenge = '';
var yourIcon = L.icon({
    iconUrl: '/images/marker-icon.png',
    iconSize: [25, 25],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
    clickable: true
});
var trashIcon = L.icon({
    iconUrl: '/images/trash-icon.png',
    iconSize: [25, 25],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
    clickable: true
});

var selectedTrashIcon = L.icon({
    iconUrl: '/images/marker_trashcan_picked.png',
    iconSize: [25, 25],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
    clickable: true
});

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
            console.log("stop");
            for (var i = 0; i < route.length; i++) {
                addMarker(map, route[i].x, route[i].y, 'route');
            }
            $('#take-picture').removeClass('hidden');
            $('#take-picture').click();
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
    addMarker(map, position.coords.latitude, position.coords.longitude, "me");


    loadTrash();
}

function addMarker(map, x, y, type) {
    var marker = L.marker([x, y], {icon: yourIcon}).on('click', function (e) {
        alert(e.latlng)
    });
    marker.addTo(map);
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
    console.log($('#resultImage').attr('src'));
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    var imageObj1 = new Image();
    var imageObj2 = new Image();
    imageObj1.src = $('#resultImage').attr('src');
    imageObj1.onload = function () {
        ctx.drawImage(imageObj1, 0, 0, 400, 500);
        imageObj2.src = "/images/brugge.jpg";
        imageObj2.onload = function () {
            ctx.drawImage(imageObj2, 0, 0, 50, 50);
            ctx.fillStyle = "#741448";
            ctx.fillRect(50, 0, 250, 50);
            ctx.stroke();
            ctx.fillStyle = "white";
            ctx.font = "30px Arial";
            ctx.fillText(`${challenge} run`, 75, 35);
            var link = document.createElement("a");
            link.download = "Yield_Map.png";
            link.href = c.toDataURL('image/png');
            link.click();
            $('#map').addClass('hidden');
            $('#stop').addClass('hidden');
            $('#blameCompanies').removeClass('hidden');
            $('h2').text("tag the companies you collected!");
            $('#take-picture').addClass('hidden');
        }
    }

}


function loadTrash() {
    afvalmanden = afvalmanden.filter(x => x.json_geometry !== undefined);
    for (var i = 0; i < afvalmanden.length; i++) {
        //addMarker(map,afvalmanden[i].json_geometry.coordinates[1], afvalmanden[i].json_geometry.coordinates[0], "trash");
        let marker = L.marker([afvalmanden[i].json_geometry.coordinates[1], afvalmanden[i].json_geometry.coordinates[0]], {icon: trashIcon}).addTo(map)
        marker.on('click', function (e) {
            var layer = e.target;
            layer.setIcon(selectedTrashIcon);
            console.log("clicked");
            $('h2').text("start running");
            $('#skip').addClass("hidden");
            $('#stop').removeClass("hidden");
        });
    }
}

function chooseChallenge(e) {
    e.preventDefault();
    challenge = $(this).data('challenge');
    $('h2').text("choose your destination");
    $('#challenges').removeClass("showing");
    $('#challenges').addClass("hidden");
    $('#map').removeClass("hidden");
    $('#skip').removeClass("hidden");
    getLocation();
    startRunning();
    console.log($(this))
}

$(document).ready(function () {
    // add code here

    $('#submitCompanies').on('click',function (e) {
        e.preventDefault();
        console.log("blame")
        $('#map').addClass('hidden');
        $('#challenges').removeClass('hidden');
        $('#stop').addClass('hidden')
        $('#blameCompanies').addClass('hidden');
    });

    $('#skip').on('click', function () {
        $('#skip').addClass("hidden");
        $('#stop').removeClass("hidden");
        $('h2').text("start running");
    });
    $('#stop').on('click', function () {
        stop = true;
    });

    $("#take-picture").change(function () {
        readURL(this);
    });
    $('#challenges a').on('click', chooseChallenge)
});