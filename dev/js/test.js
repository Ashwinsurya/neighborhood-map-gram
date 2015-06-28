// Single Marker Implementation
// User can search a location and display the corresponding marker
// https://www.youtube.com/watch?v=2n_r0NDekgc

'use strict';

function initialize() {

  var myLatlng = new google.maps.LatLng(45.5015217,-73.5732091);

  var mapOptions = {
    zoom: 11,
    center: myLatlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  var marker = new google.maps.Marker({
    position: myLatlng,
    title: 'Montréal, QC',
    map: map
  });


  var searchBox = new google.maps.places.SearchBox(document.getElementById('pac-input'));

  // Search a new location and move the marker to the new location
  google.maps.event.addListener(searchBox, 'places_changed', function(){
    var places = searchBox.getPlaces();

    // Bound
    var bounds = new google.maps.LatLngBounds();
    var i, place;

    for(i = 0; place = places[i]; i++){
      bounds.extend(place.geometry.location);
      marker.setPosition(place.geometry.location); // Set market position
    }

    map.fitBounds(bounds); // Fit the bound
    map.setZoom(14); // Set zoom
  });
}

google.maps.event.addDomListener(window, 'load', initialize);



