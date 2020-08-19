// Initialize and add the map
var map = {};
var center;
var markerArray = [];
var specificCampuslocations;
var geocoder;
var findMeInput;
var findMeMarker;
var fromInput = [];
var toInput = [];
var fromSearchBox = [];
var toSearchBox = [];
var directionsService;
var directionsRenderer;
var pressedIcon;

var currentBrowser = navigator.userAgent,
    usingIE = currentBrowser.indexOf("MSIE") > -1;
if (!usingIE) {
    alert("Please note that this map (specifically clicking on the map markers) is not as effective on Internet Explorer. It is recommended that you use this map in a different browser.");
}
else {
    
}

function initMap() {
    // create the simple atlas basemap
    simple_atlas = new google.maps.StyledMapType(
        [
            {
                elementType: "geometry",
                stylers: [{
                    gamma: "0.7"
                }]
            },
            {
                elementType: "labels.text.fill",
                stylers: [{
                    color: "#999999"
                }]
            },
            {
                elementType: "labels.text.stroke",
                stylers: [{
                    color: "#ffffff"
                }]
            },
            {
                featureType: "administrative",
                elementType: "geometry.stroke",
                stylers: [{
                    color: "#ffffff"
                }]
            },
            {
                featureType: "administrative.land_parcel",
                elementType: "geometry.stroke",
                stylers: [{
                    color: "#dcd2be"
                }]
            },
            {
                featureType: "administrative.land_parcel",
                elementType: "labels.text.fill",
                stylers: [{
                    color: "#ae9e90"
                }]
            },
            {
                featureType: "poi",
                elementType: "labels",
                stylers: [{
                    visibility: "off"
                }]
            },
            {
                featureType: "poi",
                elementType: "geometry",
                stylers: [{
                    gamma: "5"
                }]
            },
            {
                featureType: "poi.park",
                elementType: "geometry.fill",
                stylers: [{
                    color: "#ccffcc",
                    saturation: "-80"
                }]
            },
            {
                featureType: "road",
                elementType: "geometry",
                stylers: [{
                    color: "#ffffff"
                }]
            },
            {
                featureType: "road",
                elementType: "geometry.stroke",
                stylers: [{
                    color: "#808080"
                }]
            },
            {
                featureType: "road.highway",
                elementType: "geometry.stroke",
                stylers: [{
                    color: "#808080"
                }]
            },
            {
                featureType: "road.highway.controlled_access",
                elementType: "geometry.stroke",
                stylers: [{
                    color: "#808080"
                }]
            },
            {
                featureType: "road",
                elementType: "labels.text.fill",
                stylers: [{
                    color: "#808080"
                }]
            },
            {
                featureType: "transit.line",
                elementType: "geometry",
                stylers: [{
                    color: "#dfd2ae"
                }]
            },
            {
                featureType: "transit.line",
                elementType: "labels.text.fill",
                stylers: [{
                    color: "#8f7d77"
                }]
            },
            {
                featureType: "transit.line",
                elementType: "labels.text.stroke",
                stylers: [{
                    color: "#ebe3cd"
                }]
            },
            {
                featureType: "transit.station",
                elementType: "labels",
                stylers: [{
                    visibility: "off"
                }]
            },
            {
                featureType: "water",
                elementType: "geometry.fill",
                stylers: [{
                    color: "#b3ccff"
                }]
            },
            {
                featureType: "water",
                elementType: "labels.text.fill",
                stylers: [{
                    color: "#6699ff"
                }]
            }
        ],
        {
            name: "Simple Atlas"
        }
    );

    // The center of the initial map (somewhere in Claremont Park)    
    center = {
        coordinates: new google.maps.LatLng(40.8368, -73.9199)
    };
    // The map, centered at "center"    
    map = new google.maps.Map(
        document.getElementById('map'),
        {
            zoom: 14,
            center: center.coordinates,
            mapTypeControl: false,
            fullscreenControl: false
        }
    );

    //Associate the styled map with the MapTypeId and set it to display.    
    map.mapTypes.set("simple_atlas", simple_atlas);
    map.setMapTypeId("simple_atlas");

    // Defining the icons that I'll be using (icons are sized based on the decimal at the end of the url, aka "...scale=____")    
    map.icons = {
        campus: {
            icon: "https://mt.googleapis.com/vt/icon/name=icons/onion/SHARED-mymaps-container-bg_4x.png,icons/onion/SHARED-mymaps-container_4x.png,icons/onion/1807-hospital-h_4x.png&highlight=ff000000,01579B&scale=1.4"
        },
        emergency: {
            icon: "https://mt.googleapis.com/vt/icon/name=icons/onion/SHARED-mymaps-container-bg_4x.png,icons/onion/SHARED-mymaps-container_4x.png,icons/onion/1624-medical_4x.png&highlight=ff000000,FF5252&scale=1.2"
        },
        ambulatory: {
            icon: "https://mt.googleapis.com/vt/icon/name=icons/onion/SHARED-mymaps-container-bg_4x.png,icons/onion/SHARED-mymaps-container_4x.png,icons/onion/1603-house_4x.png&highlight=ff000000,0288D1&scale=1.2"
        },
        specialCareAndLifeRecovery: {
            icon: "https://mt.googleapis.com/vt/icon/name=icons/onion/SHARED-mymaps-container-bg_4x.png,icons/onion/SHARED-mymaps-container_4x.png,icons/onion/1602-hotel-bed_4x.png&highlight=ff000000,0F9D58&scale=1.2"
        },
        covidTestingTent: {
            icon: "https://mt.googleapis.com/vt/icon/name=icons/onion/SHARED-mymaps-container-bg_4x.png,icons/onion/SHARED-mymaps-container_4x.png,icons/onion/1765-camping-tent_4x.png&highlight=ff000000,C2185B&scale=1.2"
        },
        pharmacy: {
            icon: "https://mt.googleapis.com/vt/icon/name=icons/onion/SHARED-mymaps-container-bg_4x.png,icons/onion/SHARED-mymaps-container_4x.png,icons/onion/1646-pharmacy_4x.png&highlight=ff000000,F9A825&scale=1.0"
        },
        garden: {
            icon: "https://mt.googleapis.com/vt/icon/name=icons/onion/SHARED-mymaps-container-bg_4x.png,icons/onion/SHARED-mymaps-container_4x.png,icons/onion/1582-garden-flower_4x.png&highlight=ff000000,7CB342&scale=1.0"
        },
        bus: {
            icon: "https://mt.googleapis.com/vt/icon/name=icons/onion/SHARED-mymaps-container-bg_4x.png,icons/onion/SHARED-mymaps-container_4x.png,icons/onion/1532-bus_4x.png&highlight=ff000000,9C27B0&scale=0.8"
        },
        subway: {
            icon: "https://mt.googleapis.com/vt/icon/name=icons/onion/SHARED-mymaps-container-bg_4x.png,icons/onion/SHARED-mymaps-container_4x.png,icons/onion/1719-tram_4x.png&highlight=ff000000,673AB7&scale=0.8"
        }
    };
    
    map.iconsClicked = {
    	campus: {
            icon: "https://mt.googleapis.com/vt/icon/name=icons/onion/SHARED-mymaps-container-bg_4x.png,icons/onion/SHARED-mymaps-container_4x.png,icons/onion/1807-hospital-h_4x.png&highlight=ff000000,01579B&scale=2.0"
        },
        emergency: {
            icon: "https://mt.googleapis.com/vt/icon/name=icons/onion/SHARED-mymaps-container-bg_4x.png,icons/onion/SHARED-mymaps-container_4x.png,icons/onion/1624-medical_4x.png&highlight=ff000000,FF5252&scale=2.0"
        },
        ambulatory: {
            icon: "https://mt.googleapis.com/vt/icon/name=icons/onion/SHARED-mymaps-container-bg_4x.png,icons/onion/SHARED-mymaps-container_4x.png,icons/onion/1603-house_4x.png&highlight=ff000000,0288D1&scale=2.0"
        },
        specialCareAndLifeRecovery: {
            icon: "https://mt.googleapis.com/vt/icon/name=icons/onion/SHARED-mymaps-container-bg_4x.png,icons/onion/SHARED-mymaps-container_4x.png,icons/onion/1602-hotel-bed_4x.png&highlight=ff000000,0F9D58&scale=2.0"
        },
        covidTestingTent: {
            icon: "https://mt.googleapis.com/vt/icon/name=icons/onion/SHARED-mymaps-container-bg_4x.png,icons/onion/SHARED-mymaps-container_4x.png,icons/onion/1765-camping-tent_4x.png&highlight=ff000000,C2185B&scale=2.0"
        },
        pharmacy: {
            icon: "https://mt.googleapis.com/vt/icon/name=icons/onion/SHARED-mymaps-container-bg_4x.png,icons/onion/SHARED-mymaps-container_4x.png,icons/onion/1646-pharmacy_4x.png&highlight=ff000000,F9A825&scale=2.0"
        },
        garden: {
            icon: "https://mt.googleapis.com/vt/icon/name=icons/onion/SHARED-mymaps-container-bg_4x.png,icons/onion/SHARED-mymaps-container_4x.png,icons/onion/1582-garden-flower_4x.png&highlight=ff000000,7CB342&scale=2.0"
        },
        bus: {
            icon: "https://mt.googleapis.com/vt/icon/name=icons/onion/SHARED-mymaps-container-bg_4x.png,icons/onion/SHARED-mymaps-container_4x.png,icons/onion/1532-bus_4x.png&highlight=ff000000,9C27B0&scale=2.0"
        },
        subway: {
            icon: "https://mt.googleapis.com/vt/icon/name=icons/onion/SHARED-mymaps-container-bg_4x.png,icons/onion/SHARED-mymaps-container_4x.png,icons/onion/1719-tram_4x.png&highlight=ff000000,673AB7&scale=2.0"
        }
    };

    map.nonCampusIcons = {
        campus: {
            icon: "https://mt.googleapis.com/vt/icon/name=icons/onion/SHARED-mymaps-container-bg_4x.png,icons/onion/SHARED-mymaps-container_4x.png,icons/onion/1807-hospital-h_4x.png&highlight=ff000000,BDBDBD&scale=1.4"
        },
        emergency: {
            icon: "https://mt.googleapis.com/vt/icon/name=icons/onion/SHARED-mymaps-container-bg_4x.png,icons/onion/SHARED-mymaps-container_4x.png,icons/onion/1624-medical_4x.png&highlight=ff000000,BDBDBD&scale=1.2"
        },
        ambulatory: {
            icon: "https://mt.googleapis.com/vt/icon/name=icons/onion/SHARED-mymaps-container-bg_4x.png,icons/onion/SHARED-mymaps-container_4x.png,icons/onion/1603-house_4x.png&highlight=ff000000,BDBDBD&scale=1.2"
        },
        specialCareAndLifeRecovery: {
            icon: "https://mt.googleapis.com/vt/icon/name=icons/onion/SHARED-mymaps-container-bg_4x.png,icons/onion/SHARED-mymaps-container_4x.png,icons/onion/1602-hotel-bed_4x.png&highlight=ff000000,BDBDBD&scale=1.2"
        },
        covidTestingTent: {
            icon: "https://mt.googleapis.com/vt/icon/name=icons/onion/SHARED-mymaps-container-bg_4x.png,icons/onion/SHARED-mymaps-container_4x.png,icons/onion/1765-camping-tent_4x.png&highlight=ff000000,BDBDBD&scale=1.2"
        },
        pharmacy: {
            icon: "https://mt.googleapis.com/vt/icon/name=icons/onion/SHARED-mymaps-container-bg_4x.png,icons/onion/SHARED-mymaps-container_4x.png,icons/onion/1646-pharmacy_4x.png&highlight=ff000000,BDBDBD&scale=1.0"
        },
        garden: {
            icon: "https://mt.googleapis.com/vt/icon/name=icons/onion/SHARED-mymaps-container-bg_4x.png,icons/onion/SHARED-mymaps-container_4x.png,icons/onion/1582-garden-flower_4x.png&highlight=ff000000,BDBDBD&scale=1.0"
        },
        bus: {
            icon: "https://mt.googleapis.com/vt/icon/name=icons/onion/SHARED-mymaps-container-bg_4x.png,icons/onion/SHARED-mymaps-container_4x.png,icons/onion/1532-bus_4x.png&highlight=ff000000,BDBDBD&scale=0.8"
        },
        subway: {
            icon: "https://mt.googleapis.com/vt/icon/name=icons/onion/SHARED-mymaps-container-bg_4x.png,icons/onion/SHARED-mymaps-container_4x.png,icons/onion/1719-tram_4x.png&highlight=ff000000,BDBDBD&scale=0.8"
        }
    }

    // Define the location of each marker using longitude and latitude 
    map.location = [
        {
            name: "concourse_campus",
            coordinates: new google.maps.LatLng(40.8435, -73.9111),
            type: "campus"
        }, {
            name: "fulton_campus",
            coordinates: new google.maps.LatLng(40.831379, -73.9030),
            type: "campus"
        }, {
            name: "health_wellness_center",
            coordinates: new google.maps.LatLng(40.843296, -73.909768),
            type: "ambulatory"
        }, {
            name: "milstein_building",
            coordinates: new google.maps.LatLng(40.843296, -73.910128),
            type: "ambulatory"
        }, {
            name: "rehab_dental",
            coordinates: new google.maps.LatLng(40.846472, -73.909948),
            type: "ambulatory"
        }, {
            name: "crotona_park",
            coordinates: new google.maps.LatLng(40.838948, -73.899426),
            type: "ambulatory"
        }, {
            name: "mlk_franklin",
            coordinates: new google.maps.LatLng(40.83116, -73.9031),
            type: "ambulatory"
        }, {
            name: "mbd",
            coordinates: new google.maps.LatLng(40.835659, -73.885283),
            type: "ambulatory"
        }, {
            name: "poe",
            coordinates: new google.maps.LatLng(40.860525, -73.897768),
            type: "ambulatory"
        }, {
            name: "ogden",
            coordinates: new google.maps.LatLng(40.834936, -73.928451),
            type: "ambulatory"
        }, {
            name: "third_avenue",
            coordinates: new google.maps.LatLng(40.814623, -73.920833),
            type: "ambulatory"
        }, {
            name: "special_care_center",
            coordinates: new google.maps.LatLng(40.831555, -73.904222),
            type: "specialCareAndLifeRecovery"
        }, {
            name: "life_recovery_center",
            coordinates: new google.maps.LatLng(40.8321, -73.9038),
            type: "specialCareAndLifeRecovery"
        }, {
            name: "concourse_campus_covid_testing",
            coordinates: new google.maps.LatLng(40.84315, -73.9106),
            type: "covidTestingTent"
        }, {
            name: "fulton_campus_covid_testing",
            coordinates: new google.maps.LatLng(40.83122, -73.903077),
            type: "covidTestingTent"
        }, {
            name: "3av_covid_testing",
            coordinates: new google.maps.LatLng(40.814605, -73.920848),
            type: "covidTestingTent"
        }, {
            name: "drug_depot_corp",
            coordinates: new google.maps.LatLng(40.831742, -73.901679),
            type: "pharmacy"
        }, {
            name: "south_bronx_rx_inc",
            coordinates: new google.maps.LatLng(40.84357, -73.9106),
            type: "pharmacy"
        }, {
            name: "161st_pharma_inc",
            coordinates: new google.maps.LatLng(40.825749, -73.918114),
            type: "pharmacy"
        }, {
            name: "paramount_specialty",
            coordinates: new google.maps.LatLng(40.76871, -73.425944),
            type: "pharmacy"
        }, {
            name: "first_health_pharmacy",
            coordinates: new google.maps.LatLng(40.830697, -73.903541),
            type: "pharmacy"
        }, {
            name: "jolin_pharmacy",
            coordinates: new google.maps.LatLng(40.848608, -73.90629),
            type: "pharmacy"
        }, {
            name: "pilgrim_pharmacy_inc",
            coordinates: new google.maps.LatLng(40.84692, -73.832713),
            type: "pharmacy"
        }, {
            name: "bright_pharma_inc",
            coordinates: new google.maps.LatLng(40.838873, -73.914898),
            type: "pharmacy"
        }, {
            name: "rite_choice",
            coordinates: new google.maps.LatLng(40.839835, -73.91622),
            type: "pharmacy"
        }, {
            name: "a1_health_pharmacy",
            coordinates: new google.maps.LatLng(40.833079, -73.92946),
            type: "pharmacy"
        }, {
            name: "garden_of_eden",
            coordinates: new google.maps.LatLng(40.843475, -73.907407),
            type: "garden"
        }, {
            name: "gc_mea",
            coordinates: new google.maps.LatLng(40.843451, -73.911571),
            type: "bus"
        }, {
            name: "gc_emea",
            coordinates: new google.maps.LatLng(40.842846, -73.912333),
            type: "bus"
        }, {
            name: "ma_mep",
            coordinates: new google.maps.LatLng(40.843343, -73.909428),
            type: "bus"
        }, {
            name: "ma_emea",
            coordinates: new google.maps.LatLng(40.842458, -73.909702),
            type: "bus"
        }, {
            name: "ma_e174st_1",
            coordinates: new google.maps.LatLng(40.844707, -73.909291),
            type: "bus"
        }, {
            name: "ma_e174st_2",
            coordinates: new google.maps.LatLng(40.8445, -73.909506),
            type: "bus"
        }, {
            name: "fa_e169st",
            coordinates: new google.maps.LatLng(40.831498, -73.902242),
            type: "bus"
        }, {
            name: "3a_e169st",
            coordinates: new google.maps.LatLng(40.832893, -73.905029),
            type: "bus"
        }, {
            name: "3a_e168st",
            coordinates: new google.maps.LatLng(40.831318, -73.905619),
            type: "bus"
        }, {
            name: "e168st_fa",
            coordinates: new google.maps.LatLng(40.830327, -73.903723),
            type: "bus"
        }, {
            name: "gc_eta",
            coordinates: new google.maps.LatLng(40.849061, -73.905984),
            type: "bus"
        }, {
            name: "gc_e177st",
            coordinates: new google.maps.LatLng(40.849053, -73.906666),
            type: "bus"
        }, {
            name: "e170st_wa_1",
            coordinates: new google.maps.LatLng(40.839764, -73.916266),
            type: "bus"
        }, {
            name: "e170st_wa_2",
            coordinates: new google.maps.LatLng(40.839382, -73.915719),
            type: "bus"
        }, {
            name: "w170st_ja",
            coordinates: new google.maps.LatLng(40.840214, -73.917807),
            type: "bus"
        }, {
            name: "e170st_gc_1",
            coordinates: new google.maps.LatLng(40.838711, -73.914141),
            type: "bus"
        }, {
            name: "e170st_gc_2",
            coordinates: new google.maps.LatLng(40.838966, -73.913996),
            type: "bus"
        }, {
            name: "e169st_br",
            coordinates: new google.maps.LatLng(40.831151, -73.900474),
            type: "bus"
        }, {
            name: "br_e168st_1",
            coordinates: new google.maps.LatLng(40.829826, -73.901829),
            type: "bus"
        }, {
            name: "br_e168st_2",
            coordinates: new google.maps.LatLng(40.829367, -73.902623),
            type: "bus"
        }, {
            name: "mea",
            coordinates: new google.maps.LatLng(40.844455, -73.914643),
            type: "subway"
        }, {
            name: "174-175sts",
            coordinates: new google.maps.LatLng(40.8465, -73.909728),
            type: "subway"
        }, {
            name: "fs",
            coordinates: new google.maps.LatLng(40.830155, -73.891776),
            type: "subway"
        }, {
            name: "ta",
            coordinates: new google.maps.LatLng(40.850408, -73.905224),
            type: "subway"
        }, {
            name: "170sts_1",
            coordinates: new google.maps.LatLng(40.840011, -73.913312),
            type: "subway"
        }, {
            name: "170sts_2",
            coordinates: new google.maps.LatLng(40.840034, -73.917821),
            type: "subway"
        }, {
            name: "f",
            coordinates: new google.maps.LatLng(40.735669, -73.441752),
            type: "subway"
        }, {
            name: "p",
            coordinates: new google.maps.LatLng(40.745266, -73.399894),
            type: "subway"
        }, {
            name: "concourse_campus_concourse_entrance",
            coordinates: new google.maps.LatLng(40.843556, -73.911441),
            type: "ambulatory"
        }, {
            name: "concourse_campus_selwyn_entrance",
            coordinates: new google.maps.LatLng(40.843414, -73.910556),
            type: "ambulatory"
        }, {
            name: "concourse_campus_emergency_entrance",
            coordinates: new google.maps.LatLng(40.843301, -73.910875),
            type: "emergency"
        }, {
            name: "fulton_campus_fulton_entrance",
            coordinates: new google.maps.LatLng(40.83164, -73.903534),
            type: "ambulatory"
        }, {
            name: "fulton_campus_franklin_entrance",
            coordinates: new google.maps.LatLng(40.831265, -73.902847),
            type: "ambulatory"
        }, {
            name: "fulton_campus_cpep_entrance",
            coordinates: new google.maps.LatLng(40.831385, -73.90256),
            type: "emergency"
        }
    ];


    // Create the markers and add them to the array so they can be referenced later on 
    // Had to change "var i" to "let i" because otherwise the markerArray[i] in the event Listener kept being...
    // ...undefined for the final loop iteration of i. Somehow this edit allows each iterated value of i to be connected...
    // ...to its respective marker

    for (let i = 0; i < map.location.length; i++) {
        map.marker = new google.maps.Marker({
            name: map.location[i].name,
            position: map.location[i].coordinates,
            icon: map.icons[map.location[i].type].icon,
            map: map,
            zIndex: map.location.length - i,
        });

        markerArray[i] = map.marker;
        // Click on marker, and map will zoom in and pan to the marker 
        google.maps.event.addListener(map.marker, 'click', function () {
            // get specific location sidebar to appear when a marker is clicked on
            focusOnLocation(i);
            openLocationSidebar(i);
        });
    };
    
    specificCampuslocations = [55, 56, 57, 58, 59, 60];
    for (var i = 0; i < specificCampuslocations.length; i++) {
        markerArray[specificCampuslocations[i]].setMap(null);
    };

    geocoder = new google.maps.Geocoder();
    findMeInput = document.getElementById("enterAddressHere");
    var searchBox = new google.maps.places.SearchBox(findMeInput);
    var previousFindMeMarker;
    map.addListener("bounds_changed", function() {
        searchBox.setBounds(map.getBounds());
    });
    searchBox.addListener("places_changed", function() {
        var places = searchBox.getPlaces();
        if (places.length == 0) {
            return;
        }
        places.forEach(function(place) {
            if (!place.geometry) {
                var findMeInfoWindow = new google.maps.InfoWindow();
                findMeInfoWindow.setContent("Returned place contains no geometry");
                return;
            }
            var findMeIcon = {
                url:"https://getdrawings.com/free-icon/you-are-here-icon-69.png",
                scaledSize: new google.maps.Size(60, 60),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(30, 60)
            };
            if (previousFindMeMarker != null) {
                previousFindMeMarker.setMap(null);
            }
            if (geolocation_marker != null) {
                geolocation_marker.setMap(null);
            }
            findMeMarker = new google.maps.Marker({
                map: map,
                icon: findMeIcon,
                title: place.name,
                position: place.geometry.location,
                zIndex: 100
            });
            previousFindMeMarker = findMeMarker;
            map.panTo(findMeMarker.position);
            map.setZoom(16);
        });
    })

    for (var i = 0; i < map.location.length; i++) {
        fromInput[i] = document.getElementById(map.location[i].name + "_from_entry");
        toInput[i] = document.getElementById(map.location[i].name + "_to_entry");
        fromSearchBox[i] = new google.maps.places.Autocomplete(fromInput[i]);
        toSearchBox[i] = new google.maps.places.Autocomplete(toInput[i]);
    }
    searchBox.addListener("places_changed", function() {
        if (findMeInput.value != null) {
            for (var i = 0; i < map.location.length; i++) {
                fromInput[i].value = findMeInput.value;
            }
        }
    })

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

}

function calculateAndDisplayRoute(locationNumber) {
    directionsService.route(
        {
            origin: {
                query: document.getElementById(map.location[locationNumber].name + "_from_entry").value
            },
            destination: {
                query: document.getElementById(map.location[locationNumber].name + "_to_entry").value
            },
            travelMode: pressedModeOfTransportation()
        },
        function(response, status) {
            if (status === "OK") {
                directionsRenderer.setPanel(document.getElementById(map.location[locationNumber].name + "_step_by_step_directions"));
                directionsRenderer.setDirections(response);
                $("#" + map.location[locationNumber].name + "_send_directions_options").show();
            } else {
                alert("Directions request failed due to " + status);
            }
        }
    );
}

// reset all markers from index a to index b
function resetMarkers(a, b) {
    for (var i = a; i < b; i++) {
        markerArray[i].setIcon(map.icons[map.location[i].type].icon);
    }
}

var geolocation_marker = null;
var geolocationLat;
var geolocationLng;
function geolocation() {
    if (findMeMarker != null) {
        findMeMarker.setMap(null);
    }
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const currentPosition = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                geolocationLat = position.coords.latitude;
                geolocationLng = position.coords.longitude;
                var geolocationIcon = {
                    url:"https://getdrawings.com/free-icon/you-are-here-icon-69.png",
                    scaledSize: new google.maps.Size(60, 60),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(30, 60)
                };
                geolocation_marker = new google.maps.Marker({
                    position: currentPosition,
                    map: map,
                    icon: geolocationIcon,
                    zIndex: 100
                });
                map.panTo(currentPosition);
                map.setZoom(16);
                geocodeLatLng(geocoder);
            },
            function() {
                handleLocationError(true, new google.maps.InfoWindow(), map.center);
            }
        );
    } else {
        // Browser doesn't support geolocation
        handleLocationError(false, new google.maps.InfoWindow(), map.center);
    }
}
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
        browserHasGeolocation
            ? "Error: The Geolocation service failed."
            : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
}
function geocodeLatLng(geocoder) {
    const geolocationLatLng = {
        lat: geolocationLat,
        lng: geolocationLng
    };
    geocoder.geocode({location: geolocationLatLng}, function(results, status) {
        if (status === "OK") {
            if (results[0]) {
            }
            else {
                alert("No results found");
            }
            findMeInput.value = results[0].formatted_address;
            for (var i = 0; i < map.location.length; i++) {
                fromInput[i].value = findMeInput.value;
            }
        }
        else {
            alert("Geocoder failed due to: " + status);
        }
    });
}

function focusOnLocation(specific) {
    map.setZoom(19);
    map.panTo(markerArray[specific].position);
    //set all other markers back to normal
    resetMarkers(0, map.location.length);
    markerArray[specific].setIcon(map.iconsClicked[map.location[specific].type].icon);
    // pull specific marker to the front so it isn't partially blocked by neighboring markers
    for (var i = 0; i < map.location.length; i++) {
        markerArray[i].zIndex = map.location.length - i;
    };
    markerArray[specific].zIndex = 100;
}


var currentSidebar = "main_sidebar";
function openMainSidebar() {
    resetMarkers(0, map.location.length);
    $("#" + currentSidebar).hide();
    $("#main_sidebar").show();
    for (var i = 0; i < specificCampuslocations.length; i++) {
        markerArray[specificCampuslocations[i]].setMap(null);
    };
}
function openLocationSidebar(markerNumber) {
    $("#main_sidebar").hide();
    $("#" + currentSidebar).hide();
    currentSidebar = markerArray[markerNumber].name + "_sidebar";
    $("#" + currentSidebar).show();
    focusOnLocation(markerNumber);
    if (markerNumber == 0 || markerNumber == 55 || markerNumber == 56 || markerNumber == 57) {
        for (var i = 1; i <= 54; i++) {
            markerArray[i].setIcon(map.nonCampusIcons[map.location[i].type].icon);
        }
        for (var i = 55; i <= 57; i++) {
            markerArray[i].setMap(map);
        }
        for (var i = 58; i <= 60; i++) {
            markerArray[i].setIcon(map.nonCampusIcons[map.location[i].type].icon);
        }
    }
    else if (markerNumber == 1 || markerNumber == 58 || markerNumber == 59 || markerNumber == 60) {
        markerArray[0].setIcon(map.nonCampusIcons[map.location[0].type].icon);
        for (var i = 2; i <= 57; i++) {
            markerArray[i].setIcon(map.nonCampusIcons[map.location[i].type].icon);
        }
        for (var i = 58; i <= 60; i++) {
            markerArray[i].setMap(map);
        }
    }
    else {
        for (var i = 55; i <= 60; i++) {
            markerArray[i].setMap(null);
        }
        for (var i = 0; i <= 60; i++) {
            markerArray[i].setIcon(map.icons[map.location[i].type].icon);
        }
        markerArray[markerNumber].setIcon(map.iconsClicked[map.location[markerNumber].type].icon)
    }
}
var practicesArray = [
    {
        name: "breast_care_center",
        type: "health_wellness_center"
    }, {
        name: "surgery_center",
        type: "health_wellness_center"
    }, {
        name: "medical_specialties",
        type: "health_wellness_center"
    }, {
        name: "adult_medicine_practice",
        type: "health_wellness_center"
    }, {
        name: "pulmonary_asthma_services",
        type: "health_wellness_center"
    }, {
        name: "orthopedic_specialties",
        type: "health_wellness_center"
    }, {
        name: "gynecologic_care",
        type: "health_wellness_center"
    }, {
        name: "radiology",
        type: "health_wellness_center"
    }, {
        name: "center_for_comprehensive_care",
        type: "milstein_building"
    }, {
        name: "oncology",
        type: "milstein_building"
    }, {
        name: "neurology",
        type: "milstein_building"
    }, {
        name: "rehab",
        type: "rehab_dental"
    }, {
        name: "womens_health_center",
        type: "concourse_campus_concourse_entrance"
    }, {
        name: "cardiology",
        type: "concourse_campus_concourse_entrance"
    }, {
        name: "orthopedic_practice",
        type: "concourse_campus_selwyn_entrance"
    }, {
        name: "ear_nose_throat_practice",
        type: "concourse_campus_selwyn_entrance"
    }, {
        name: "pediatric_practice",
        type: "concourse_campus_selwyn_entrance"
    }, {
        name: "eye_care_center",
        type: "concourse_campus_selwyn_entrance"
    }, {
        name: "psychiatric_adult_outpatient_1",
        type: "fulton_campus_fulton_entrance"
    }, {
        name: "psychiatric_adult_outpatient_2",
        type: "fulton_campus_fulton_entrance"
    }, {
        name: "comprehensive_pain_management",
        type: "fulton_campus_fulton_entrance"
    }, {
        name: "family_medicine_practice",
        type: "fulton_campus_fulton_entrance"
    }, {
        name: "child_study_center",
        type: "fulton_campus_fulton_entrance"
    }, {
        name: "opioid_treatment_program",
        type: "fulton_campus_fulton_entrance"
    }, {
        name: "family_wellness_center",
        type: "fulton_campus_fulton_entrance"
    }
]
function openPracticesSidebar(practicesNumber) {
    $("#main_sidebar").hide();
    $("#" + currentSidebar).hide();
    currentSidebar = practicesArray[practicesNumber].name + "_practices_sidebar";
    $("#" + currentSidebar).show();
}
function openDirectionsSidebar(markerNumber) {
    $("#main_sidebar").hide();
    $("#" + currentSidebar).hide();
    currentSidebar = markerArray[markerNumber].name + "_directions_sidenav";
    $("#" + currentSidebar).show();
    publicTransitPressed();
}

var checklist = ["hospital_campuses", "ambulatory_practices", "specialCare_center", "lifeRecovery_center", "covid_testing", "pharmacies", "garden", "public_transportation"];

function resetEverything() {
    map.setZoom(14);
    map.panTo(center.coordinates);
    openMainSidebar();
    document.getElementById("filter_options").value = "all";
    resetMarkers(0, map.location.length);
    if (geolocation_marker != null) {
        geolocation_marker.setMap(null);
    }
    if (findMeMarker != null) {
        findMeMarker.setMap(null);
    }
    document.getElementById("enterAddressHere").value = null;
    for (var i = 0; i < map.location.length; i++) {
        markerArray[i].zIndex = map.location.length - i;
        markerArray[i].setMap(map);
    }
    for (var i = 0; i < specificCampuslocations.length; i++) {
        markerArray[specificCampuslocations[i]].setMap(null);
    };
    for (var j = 0; j < checklist.length; j++) {
        $("#" + checklist[j]).prop("checked", true);
        $("#" + checklist[j] + "_list").show();
    }
    for (var i = 0; i <= 15; i++) {
        $("#location_checklist_" + i).show();
    }
    directionsRenderer.setMap(null);
}

// indices of the locations within (or not within) each of the three "filter by" categories
var blhcLocations = [0, 2, 3, 4, 13, 26];
var notBlhcLocations = [1, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15];
var mlkLocations = [1, 4, 5, 6, 7, 8, 9, 10, 14, 15, 26];
var notMlkLocations = [0, 2, 3, 11, 12, 13];
var psychLocations = [11, 12, 26];
var notPsychLocations = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 13, 14, 15];
// The following function are used to show/hide list items and markers when certain dropdown option is selected
$(document).ready(function() {
    $("#filter_options").change(function() {
        var value = document.getElementById("filter_options").value;
        if (value == "all") {
            // show everything (both list items and corresponding markers)
            for (var i = 0; i < checklist.length; i++) {
                $("#" + checklist[i] + "_list").show();
                $("#" + checklist[i]).prop("checked", true);
            }
            for (var i = 0; i <= 15; i++) {
                $("#location_checklist_" + i).show();
            }
            for (var i = 0; i < markerArray.length; i++) {
                markerArray[i].setMap(map);
            }
        }
        else if (value == "blhc") {
            // hide these list items and corresponding markersS
            for (var i = 0; i < notBlhcLocations.length; i++) {
                markerArray[notBlhcLocations[i]].setMap(null);
                $("#location_checklist_" + notBlhcLocations[i]).hide();
            }
            $("#specialCare_center").prop("checked", false);
            $("#lifeRecovery_center").prop("checked", false);
            $("#pharmacies").prop("checked", false);
            $("#public_transportation").prop("checked", false);
            $("#pharmacies_list").hide();
            $("#public_transportation_list").hide();
            for (var i = 16; i < map.location.length; i++) {
                markerArray[i].setMap(null);
            }
            // show these list items and corresponding markers
            console.log(blhcLocations);
            for (var i = 0; i < blhcLocations.length; i++) {
                markerArray[blhcLocations[i]].setMap(map);
                $("#location_checklist_" + blhcLocations[i]).show();
                console.log(markerArray[blhcLocations[i]].name);
            }
            $("#hospital_campuses").prop("checked", true);
            $("#ambulatory_practices").prop("checked", true);
            $("#covid_testing").prop("checked", true);
            $("#garden").prop("checked", true);
        }
        else if (value == "mlk") {
            // hide these list items and corresponding markers
            for (var i = 0; i < notMlkLocations.length; i++) {
                markerArray[notMlkLocations[i]].setMap(null);
                $("#location_checklist_" + notMlkLocations[i]).hide();
            }
            $("#specialCare_center").prop("checked", false);
            $("#lifeRecovery_center").prop("checked", false);
            $("#pharmacies").prop("checked", false);
            $("#public_transportation").prop("checked", false);
            $("#pharmacies_list").hide();
            $("#public_transportation_list").hide();
            for (var i = 16; i < map.location.length; i++) {
                markerArray[i].setMap(null);
            }
            // show these list items and corresponding markers
            for (var i = 0; i < mlkLocations.length; i++) {
                markerArray[mlkLocations[i]].setMap(map);
                $("#location_checklist_" + mlkLocations[i]).show();
            }
            $("#hospital_campuses").prop("checked", true);
            $("#ambulatory_practices").prop("checked", true);
            $("#covid_testing").prop("checked", true);
            $("#garden").prop("checked", true);
        }
        else if (value == "psych") {
            // hide these list items and corresponding markers
            for (var i = 0; i < notPsychLocations.length; i++) {
                markerArray[notPsychLocations[i]].setMap(null);
                $("#location_checklist_" + notPsychLocations[i]).hide();
            }
            $("#hospital_campuses").prop("checked", false);
            $("#ambulatory_practices").prop("checked", false);
            $("#covid_testing").prop("checked", false);
            $("#pharmacies").prop("checked", false);
            $("#public_transportation").prop("checked", false);
            $("#pharmacies_list").hide();
            $("#public_transportation_list").hide();
            for (var i = 16; i < map.location.length; i++) {
                markerArray[i].setMap(null);
            }
            // show these list items and corresponding markers
            for (var i = 0; i < psychLocations.length; i++) {
                markerArray[psychLocations[i]].setMap(map);
                $("#location_checklist_" + psychLocations[i]).show();
            }
            $("#specialCare_center").prop("checked", true);
            $("#lifeRecovery_center").prop("checked", true);
            $("#garden").prop("checked", true);
        }
    })
});

// I couldn't figure out how to properly do this using a for loop, so I wrote it out for each category
// The following functions are all used to show/hide markers when a category is checked/unchecked
$(document).ready(function(){
    $('#hospital_campuses').click(function(){
        if(this.checked == true){
            $("#hospital_campuses_list").show();
            showHospitalCampusesMarkers();
        }
        else {
            $("#hospital_campuses_list").hide();
            hideHospitalCampusesMarkers();
        }
    });
});
$(document).ready(function(){
    $('#ambulatory_practices').click(function(){
        if(this.checked == true){
            $("#ambulatory_practices_list").show();
            showAmbulatoryPracticesMarkers();
        }
        else {
            $("#ambulatory_practices_list").hide();
            hideAmbulatoryPracticesMarkers();
        }
    });
});
$(document).ready(function(){
    $('#specialCare_center').click(function(){
        if(this.checked == true){
            $("#specialCare_center_list").show();
            showSpecialCareCenterMarkers();
        }
        else {
            $("#specialCare_center_list").hide();
            hideSpecialCareCenterMarkers();
        }
    });
});
$(document).ready(function(){
    $('#lifeRecovery_center').click(function(){
        if(this.checked == true){
            $("#lifeRecovery_center_list").show();
            showLifeRecoveryCenterMarkers();
        }
        else {
            $("#lifeRecovery_center_list").hide();
            hideLifeRecoveryCenterMarkers();
        }
    });
});
$(document).ready(function(){
    $('#covid_testing').click(function(){
        if(this.checked == true){
            $("#covid_testing_list").show();
            showCovidTestingMarkers();
        }
        else {
            $("#covid_testing_list").hide();
            hideCovidTestingMarkers();
        }
    });
});
$(document).ready(function(){
    $('#pharmacies').click(function(){
        if(this.checked == true){
            $("#pharmacies_list").show();
            showPharmaciesMarkers();
        }
        else {
            $("#pharmacies_list").hide();
            hidePharmaciesMarkers();
        }
    });
});
$(document).ready(function(){
    $('#garden').click(function(){
        if(this.checked == true){
            $("#garden_list").show();
            showGardenMarkers();
        }
        else {
            $("#garden_list").hide();
            hideGardenMarkers();
        }
    });
});
$(document).ready(function(){
    $('#public_transportation').click(function(){
        if(this.checked == true){
            $("#public_transportation_list").show();
            showPublicTransportationMarkers();
        }
        else {
            $("#public_transportation_list").hide();
            hidePublicTransportationMarkers();
        }
    });
});

function hideHospitalCampusesMarkers() {
    for (var i = 0; i <= 1; i++) {
        markerArray[i].setMap(null);
    }
}
function hideAmbulatoryPracticesMarkers() {
    for (var i = 2; i <= 10; i++) {
        markerArray[i].setMap(null);
    }
}
function hideSpecialCareCenterMarkers() {
    markerArray[11].setMap(null);
}
function hideLifeRecoveryCenterMarkers() {
    markerArray[12].setMap(null);
}
function hideCovidTestingMarkers() {
    for (var i = 13; i <= 15; i++) {
        markerArray[i].setMap(null);
    }
}
function hidePharmaciesMarkers() {
    for (var i = 16; i <= 25; i++) {
        markerArray[i].setMap(null);
    }
}
function hideGardenMarkers() {
    markerArray[26].setMap(null);
}
function hidePublicTransportationMarkers() {
    for (var i = 27; i <= 54; i++) {
        markerArray[i].setMap(null);
    }
}

function showHospitalCampusesMarkers() {
    for (var i = 0; i <= 1; i++) {
        markerArray[i].setMap(map);
    }
}
function showAmbulatoryPracticesMarkers() {
    for (var i = 2; i <= 10; i++) {
        markerArray[i].setMap(map);
    }
}
function showSpecialCareCenterMarkers() {
    markerArray[11].setMap(map);
}
function showLifeRecoveryCenterMarkers() {
    markerArray[12].setMap(map);
}
function showCovidTestingMarkers() {
    for (var i = 13; i <= 15; i++) {
        markerArray[i].setMap(map);
    }
}
function showPharmaciesMarkers() {
    for (var i = 16; i <= 25; i++) {
        markerArray[i].setMap(map);
    }
}
function showGardenMarkers() {
    markerArray[26].setMap(map);
}
function showPublicTransportationMarkers() {
    for (var i = 27; i <= 54; i++) {
        markerArray[i].setMap(map);
    }
}

function publicTransitPressed() {
    $(".subway").toggleClass("pressed");
    var multipleElements = document.getElementsByClassName("subway");
    pressedIcon = multipleElements[0];
}
$(document).ready(function(){
    $(".material-icons").click(function() {
        $(this).toggleClass("pressed");
        $(".material-icons").not(this).removeClass("pressed");
        pressedIcon = this;
    });
})

function pressedModeOfTransportation() {
    if (pressedIcon == null) {
        alert("Please select a mode of transportation");
    }
    else if (pressedIcon.classList.contains("car")) {
        return "DRIVING";
    }
    else if (pressedIcon.classList.contains("subway")) {
        return "TRANSIT";
    }
    else if (pressedIcon.classList.contains("walk")) {
        return "WALKING";
    }
    else if (pressedIcon.classList.contains("bike")) {
        return "BICYCLING";
    }
    else if (pressedIcon.classList.contains("plane")) {
        return "PLANE";
    }
}


// $(document).ready(function() {
//     $(".material-icons .car").hover(function() {
//         $(".car_popup").show();
//         console.log("popup");
//     });
// });
// $(document).ready(function() {
//     $(".material-icons .subway").hover(function() {
//         $(".subway_popup").show();
//         console.log("popup");
//     });
// });
// $(document).ready(function() {
//     $(".material-icons .walk").hover(function() {
//         $(".walk_popup").show();
//         console.log("popup");
//     });
// });
// $(document).ready(function() {
//     $(".material-icons .bike").hover(function() {
//         $(".bike_popup").show();
//         console.log("popup");
//     });
// });
// $(document).ready(function() {
//     $(".material-icons .plane").hover(function() {
//         $(".plane_popup").show();
//         console.log("popup");
//     });
// });

function switchEntryFields(number) {
    var from = document.getElementById(map.location[number].name + "_from_entry").value;
    document.getElementById(map.location[number].name + "_from_entry").value = document.getElementById(map.location[number].name + "_to_entry").value;
    document.getElementById(map.location[number].name + "_to_entry").value = from;
}
function resetDirectionsEntryFields(specific) {
    document.getElementById(map.location[specific].name + "_from_entry").value = null;
    document.getElementById(map.location[specific].name + "_to_entry").value = document.getElementById(map.location[specific].name + "_to_entry").defaultValue;
    $(".material-icons").removeClass("pressed");
    directionsRenderer.setMap(null);
    directionsRenderer.setPanel(null);
    $("#" + map.location[specific].name + "_send_directions_options").hide();
}

$(document).on("keypress", "input", function(e) {
    if (e.which == 13) {
        alert("Please click on one of the autocomplete-suggested locations in order to ensure an accurate result.");
        return false;
    }
})

function sendEmail(specific) {
    // console.log(document.getElementById(map.location[specific].name + "_step_by_step_directions").innerHTML);
    var emailAddress = prompt("Please enter your email address.");
    if (validateEmail(emailAddress)) {
        Email.send({
            Host: "smtp.gmail.com",
            Username: "blissbx10457@gmail.com",
            Password: "Bronxoffice44*",
            To: emailAddress,
            From: "blissbx10457@gmail.com",
            Subject: "Step-by-Step Directions from BronxCare's Interactive Map",
            Body: document.getElementById(map.location[specific].name + "_step_by_step_directions").innerHTML,
            // Body: directionsRenderer.getPanel(map.location[specific].name + "_step_by_step_directions")
        })
        .then(function (message) {
            alert("Email sent successfully.")
        });
    }
    else if (emailAddress === null) {
        return;
    }
    else {
        alert("Please enter a valid email address.");
        sendEmail(specific);
    }
}
function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function printDirections(specific) {
    var content = window.document.getElementById(map.location[specific].name + "_step_by_step_directions");
    var newWindow = window.open();
    newWindow.document.write(content.innerHTML);
    newWindow.print();
}

//TO-DO: 
//       provide functionality for the print button
