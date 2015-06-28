'use strict';

function initialSetUp(){
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

  var infowindow = new google.maps.InfoWindow({
    content: 'Montréal, QC'
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.open(map,marker);
  });
}


function initialize() {

  // Call initial set up function above
  initialSetUp();

  var searchBox = new google.maps.places.SearchBox(document.getElementById('pac-input'));
  google.maps.event.addListener(searchBox, 'places_changed', function() {

    var places = searchBox.getPlaces();
    //////////////////// BEGIN: Instagram Search ////////////////////
    var instagramNode = document.getElementById('instagram');
    while (instagramNode.firstChild) {
      instagramNode.removeChild(instagramNode.firstChild);
    }

    var request = new XMLHttpRequest();
    var latInsta = places[0].geometry.location.A;
    var lngInsta = places[0].geometry.location.F;
    var url = 'https://api.instagram.com/v1/media/search?lat='+latInsta+'&lng='+lngInsta+'&access_token=322608956.c39a870.654d8fb14b8d48838cc430bebcb0dede';

    var map = new google.maps.Map(document.getElementById('map-canvas'), {
      zoom: 15,
      center: new google.maps.LatLng(latInsta, lngInsta),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    var infowindow = new google.maps.InfoWindow();
    var marker;

    // Making request to get photos from Instagram 
    request.open('GET', url, true);
    request.onload = function() {

      // Successfully got photos
      if (request.status >= 200 && request.status < 400) {
        var data = JSON.parse(request.responseText);

        // Insert each photo to the unordered list inside Instagram div
        var photoParent = document.createElement('ul');
        for(var i = 0; i < data.data.length; i++){
          
          // Create Photo List and append to ul
          var listEl = document.createElement('li');
          var imageEl = document.createElement('img');
          imageEl.src = data.data[i].images.thumbnail.url;
          listEl.appendChild(imageEl);
          photoParent.appendChild(listEl);


          // Check if photo has title
          function title(data){
            if((data.caption)&&(data.caption.text)){
              return data.caption.text;
            } else {
              return 'No Title';
            }
          }

          marker = new google.maps.Marker({
            position: new google.maps.LatLng(data.data[i].location.latitude, data.data[i].location.longitude),
            map: map
          });
          
          // Add event lsitener to open info window on clicking marker
          google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
              infowindow.setContent('<div class="infoWindow"><img src="'+data.data[i].images.thumbnail.url+'"><p>'+title(data.data[i]) +'</p></div>');
              infowindow.open(map, marker);
            }
          })(marker, i));

          // Add event lsitener to open info window on clicking a photo from list
          listEl.addEventListener('click', (function(marker) {
            return function(){
              google.maps.event.trigger(marker, 'click');
            }
          })(marker));
        }

        // Insert the photo lists to the Instagram div on the rigth side of screen
        instagramNode.insertBefore(photoParent, instagramNode.firstChild);


      } else {
        console.log('Something went wrong ... ');
      }
    };
    request.onerror = function() {
      console.log('Connection Error')
    };
    request.send();
    //////////////////// END: Instagram Search ////////////////////

  });

}

google.maps.event.addDomListener(window, 'load', initialize);



