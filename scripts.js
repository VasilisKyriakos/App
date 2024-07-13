document.addEventListener("DOMContentLoaded", function() {
    // Initialize the map and set its view to a default location
    var map = L.map('map').setView([38.0, 23.7], 7); // Center of Greece

    // Add the OpenStreetMap Hot tiles
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Custom marker icon
    var beachIcon = L.icon({
        iconUrl: './images/love.png', // replace with your custom marker icon URL
        iconSize: [35, 35], // size of the icon
        iconAnchor: [19, 38], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -38] // point from which the popup should open relative to the iconAnchor
    });

    // Custom marker icon
    var myIcon = L.icon({
        iconUrl: './images/location.png', // replace with your custom marker icon URL
        iconSize: [50, 50], // size of the icon
        iconAnchor: [19, 38], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -38] // point from which the popup should open relative to the iconAnchor
    });

    // Function to add markers to the map
    function addMarkers(data) {
        data.elements.forEach(function(element) {
            if (element.tags && element.tags.name) {
                var popupContent = `<strong>${element.tags.name}</strong><br>`;
                if (element.tags.description) {
                    popupContent += `${element.tags.description}<br>`;
                }
                if (element.tags.wikipedia) {
                    popupContent += `<a href="https://en.wikipedia.org/wiki/${element.tags.wikipedia}" target="_blank">Wikipedia</a><br>`;
                }

                if (element.type === "node") {
                    L.marker([element.lat, element.lon], { icon: beachIcon }).addTo(map)
                        .bindPopup(popupContent);
                } else if (element.type === "way" || element.type === "relation") {
                    var coordinates = [];
                    element.geometry.forEach(function(geo) {
                        coordinates.push([geo.lat, geo.lon]);
                    });
                    L.polyline(coordinates, { color: 'blue' }).addTo(map)
                        .bindPopup(popupContent);
                }
            }
        });
    }

    // Load the data from beaches.json
    fetch('./beaches.json')
    .then(response => response.json())
    .then(data => {
        console.log(data); // Log the data for debugging purposes
        addMarkers(data);
    })
    .catch(error => {
        console.error('Error loading data from beaches.json:', error);
    });

    // Initialize the geocoder
    var geocoder = L.Control.Geocoder.nominatim();

    // Handle search input
    document.getElementById('search').addEventListener('input', function(event) {
        var query = event.target.value;
        if (query.length > 2) {
            geocoder.geocode(query, function(results) {
                var autocompleteResults = results.map(function(result) {
                    return `<li data-lat="${result.center.lat}" data-lon="${result.center.lng}">${result.name}</li>`;
                }).join('');
                document.getElementById('autocomplete-list').innerHTML = `<ul>${autocompleteResults}</ul>`;
            });
        } else {
            document.getElementById('autocomplete-list').innerHTML = '';
        }
    });

    // Handle autocomplete selection
    document.getElementById('autocomplete-list').addEventListener('click', function(event) {
        if (event.target.tagName === 'LI') {
            var lat = event.target.getAttribute('data-lat');
            var lon = event.target.getAttribute('data-lon');
            map.setView([lat, lon], 13);
            L.marker([lat, lon]).addTo(map).bindPopup(event.target.textContent).openPopup();
            document.getElementById('autocomplete-list').innerHTML = '';
            document.getElementById('search').value = '';
        }
    });

    // Check if the browser supports geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            map.setView([lat, lon], 13);

            // Add a marker at the user's current location
            L.marker([lat, lon], { icon: myIcon }).addTo(map)
                .bindPopup('You are here.')
                .openPopup();
        }, function(error) {
            console.error("Error occurred while retrieving location: ", error);
            alert("Unable to retrieve your location. Please check your browser settings and permissions.");
        });
    } else {
        console.error("Geolocation is not supported by this browser.");
        alert("Geolocation is not supported by this browser.");
    }
});
