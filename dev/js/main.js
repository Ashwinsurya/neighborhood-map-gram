'use strict';

// function initialize() {
//   var mapCanvas = document.getElementById('map-canvas');

//   var myLatlng = new google.maps.LatLng(45.5015217,-73.5732091);

//   var mapOptions = {
//     center: myLatlng,
//     zoom: 12,
//     mapTypeId: google.maps.MapTypeId.ROADMAP
//   }
//   var map = new google.maps.Map(mapCanvas, mapOptions);

//   var marker = new google.maps.Marker({
//     position: myLatlng,
//     map: map,
//     title: 'Montreal'
//   });

// }

// google.maps.event.addDomListener(window, 'load', initialize);








function initialize() {

  var markers = [];
  var myLatlng = new google.maps.LatLng(45.5015217,-73.5732091);

  var mapOptions = {
    center: myLatlng,
    zoom: 11,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  // var defaultBounds = new google.maps.LatLngBounds(
  //   new google.maps.LatLng(45.5015217,-73.5732091),
  //   new google.maps.LatLng(45.5015217,-73.5732091)
  // );
  // map.fitBounds(defaultBounds);

  // Create the search box and link it to the UI element.
  var input = (document.getElementById('pac-input'));
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  var searchBox = new google.maps.places.SearchBox(
    /** @type {HTMLInputElement} */(input));

  // Listen for the event fired when the user selects an item from the
  // pick list. Retrieve the matching places for that item.
  google.maps.event.addListener(searchBox, 'places_changed', function() {







    var places = searchBox.getPlaces();
    

    if (places.length == 0) {
      return;
    }
    for (var i = 0, marker; marker = markers[i]; i++) {
      marker.setMap();
    }

    // For each place, get the icon, place name, and location.
    markers = [];
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0, place; place = places[i]; i++) {
      var image = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      var marker = new google.maps.Marker({
        map: map,
        icon: image,
        title: place.name,
        position: place.geometry.location
      });

      markers.push(marker);

      bounds.extend(place.geometry.location);
    }

    map.fitBounds(bounds);




    // Instagram Search 
    var instagramNode = document.getElementById('instagram');
    while (instagramNode.firstChild) {
        instagramNode.removeChild(instagramNode.firstChild);
    }

    var request = new XMLHttpRequest();
    var latInsta = places[0].geometry.location.A;
    var lngInsta = places[0].geometry.location.F;
    var url = 'https://api.instagram.com/v1/media/search?lat='+latInsta+'&lng='+lngInsta+'&access_token=322608956.c39a870.654d8fb14b8d48838cc430bebcb0dede';

    request.open('GET', url, true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        var data = JSON.parse(request.responseText);
        console.log(data.data);

        var photoParent = document.createElement('ul');
        for(var i = 0; i < data.data.length; i++){
          console.log(data.data[i]);
          var listEl = document.createElement('li');
          var imageEl = document.createElement('img');
          imageEl.src = data.data[i].images.thumbnail.url;

          listEl.appendChild(imageEl);
          photoParent.appendChild(listEl);
        }
        instagramNode.insertBefore(photoParent, instagramNode.firstChild);

      } else {
        console.log('Something went wrong ... ');
      }
    };

    request.onerror = function() {
      console.log('Connection Error')
    };

    request.send();



  });

  // Bias the SearchBox results towards places that are within the bounds of the
  // current map's viewport.
  google.maps.event.addListener(map, 'bounds_changed', function() {
    var bounds = map.getBounds();
    searchBox.setBounds(bounds);
  });
}

google.maps.event.addDomListener(window, 'load', initialize);



