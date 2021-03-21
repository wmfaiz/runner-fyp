function GetLocation () {
  if (navigator.geolocation) {
      navigator.geolocation.watchPosition(geoSuccess, geoError);
      // navigator.geolocation.watchPosition(showPosition_2);
  }
}

// function geoSuccess(position) {
//   let latitude = position.coords.latitude;
//   let longitude = position.coords.longitude;
//   localStorage.setItem("geoLatitude", latitude);
//   localStorage.setItem("geolongitude", longitude);
//   let mapBounds = new google.maps.LatLngBounds();
//   let map = new google.maps.Map(document.getElementById('map'), {
//     center: {lat: parseFloat(latitude), lng: parseFloat(longitude)},
//     zoom: 8
//   });
//   let latAndLon = new google.maps.LatLng(latitude, longitude);
//   let mapMarks = new google.maps.Marker({
//     position: latAndLon,
//     map: map
//   });
//   mapBounds.extend(latAndLon);
//   map.fitBounds(mapBounds);
// }

function geoSuccess(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  codeLatLng(latitude,longitude);
}

function codeLatLng(lat, lng) {
  geocoder = new google.maps.Geocoder();
  var latlng = new google.maps.LatLng(lat, lng);
  geocoder.geocode({'latLng': latlng}, function(results, status) {
    if(status == google.maps.GeocoderStatus.OK) {
        if(results[1]) {
            //formatted address
            var address = results[0].formatted_address;
            document.getElementById('map_location').value = address;
        } else {
            console.log("No results found");
        }
    } else {
        console.log("Geocoder failed due to: " + status);
    }
  });
}

function geoError (){
  console.log("Geo Error");
}
