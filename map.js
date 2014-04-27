var map;
var Zoom = 8;
var Center= null;

function initialize() {
  geocoder = new google.maps.Geocoder();
  
  var mylat = 41.97;
  var mylon = -87.67;
  var mapOptions = {
    zoom: Zoom,
    center: new google.maps.LatLng(mylat, mylon),
    streetViewControl: false,
    panControl: false,
    panControlOptions: {
        position: google.maps.ControlPosition.LEFT_TOP
    },
    zoomControl: true,
    zoomControlOptions: {
        style: google.maps.ZoomControlStyle.SMALL,
        position: google.maps.ControlPosition.LEFT_TOP
    }
  };

  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  
  google.maps.event.addListener(map, "zoom_changed", function() { 
    Zoom = map.getZoom(); 
    console.log(Zoom);
  });

  google.maps.event.addListener(map, "center_changed", function() { 
    Center = map.getCenter(); 
    console.log("lon: "+Center.A); // lon
    console.log("lat: "+Center.k); // lat

    // push the geodata into the location field for submit as json
    $('input#location').val("{'lon':"+Center.A+", 'lat':"+Center.k+", 'zoom':"+Zoom+"}");

  });
}

function codeAddress() {
            var userinput = document.getElementById('address').value;
            var theusa = ", usa";
            var address = userinput.concat (theusa);
            geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
    mylon = results[0].geometry.location.A;
    mylat = results[0].geometry.location.k;


    pan(mylat,mylon);

function pan(mylat, mylon) {
        var panPoint = new google.maps.LatLng(mylat, mylon);
        google.maps.event.addListener(map, "zoom_changed", function() { Zoom = map.getZoom(); 
        console.log(Zoom);});
        map.panTo(panPoint)
        console.log(mylat,mylon, Zoom);

        // Default zoom level to submit if user does not is 8.
     };
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }  
    });
};

google.maps.event.addDomListener(window, 'load', initialize);
