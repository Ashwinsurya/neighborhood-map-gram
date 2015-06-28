'use strict';

function initialize() {

  var markers = [];
  var myLatlng = new google.maps.LatLng([45.5015217,-73.5732091], [45.5015257,-73.5732091]);

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




  // markers.push(marker);

  // Create the search box and link it to the UI element.
  var input = (document.getElementById('pac-input'));
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  var searchBox = new google.maps.places.SearchBox((input));

  // Listen for the event fired when the user selects an item from the
  // pick list. Retrieve the matching places for that item.
  google.maps.event.addListener(searchBox, 'places_changed', function() {

    var places = searchBox.getPlaces();
    if (places.length == 0) {
      return;
    }


    //////////////////// Instagram Search:BEGIN ////////////////////
    var instagramNode = document.getElementById('instagram');
    while (instagramNode.firstChild) {
      instagramNode.removeChild(instagramNode.firstChild);
    }

    var request = new XMLHttpRequest();
    var latInsta = places[0].geometry.location.A;
    var lngInsta = places[0].geometry.location.F;
    var url = 'https://api.instagram.com/v1/media/search?lat='+latInsta+'&lng='+lngInsta+'&access_token=322608956.c39a870.654d8fb14b8d48838cc430bebcb0dede';

    // Making request to get photos from Instagram 
    request.open('GET', url, true);
    request.onload = function() {

      // Successfully got photos
      if (request.status >= 200 && request.status < 400) {
        var data = JSON.parse(request.responseText);

        // Insert each photo to the unordered list inside Instagram div
        var photoParent = document.createElement('ul');
        for(var i = 0; i < data.data.length; i++){
          
          var listEl = document.createElement('li');
          var imageEl = document.createElement('img');
          imageEl.src = data.data[i].images.thumbnail.url;
          listEl.appendChild(imageEl);
          photoParent.appendChild(listEl);

          ///// Set Markers on Google Map
          var myLatlng = new google.maps.LatLng(data.data[i].location.latitude, data.data[i].location.longitude);
          var mapOptions = {
            zoom: 14,
            center: myLatlng
          }
          var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

          var imgTitle = "No title";
          if(data.data[i].caption && data.data[i].caption.text){
            imgTitle = data.data[i].caption.text;
          } 

          var marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            title: imgTitle
          });
          marker.setMap();

          markers.push(marker);

          for (var i = 0, marker; marker = markers[i]; i++) {
            marker.setMap();
          }

        }

        // Insert the photo lists to the Instagram div
        instagramNode.insertBefore(photoParent, instagramNode.firstChild);


      } else {
        console.log('Something went wrong ... ');
      }
    };
    request.onerror = function() {
      console.log('Connection Error')
    };
    request.send();
    //////////////////// Instagram Search:END ////////////////////


  });

}

google.maps.event.addDomListener(window, 'load', initialize);



