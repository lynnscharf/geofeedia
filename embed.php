<!DOCTYPE html>
<html>

  <head>
  <title>Geofeedia Custom Map</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta charset="utf-8"> 
  <link rel="stylesheet" href="css/style.css">
  <script src="https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false"></script>
  <script src="js/jquery-1.9.1.min.js"></script>
  <script src="js/jquery-ui-1.10.3.custom.min.js"></script>
  <script src="js/moment.min.js"></script>
  <script src="js/jquery-ui-map30rc1.min.js"></script>
  <script src="functions.js"></script>

<script>
var map;
var url = "https://api.geofeedia.com/v1/search/collection/<?php print $_GET['collection']; ?>?appId=<?php print $_GET['appid']; ?>&appKey=<?php print $_GET['appkey']; ?>";

console.log(url);

function initialize() {
    prepGoogleAPI();
    $.getJSON(url, geofeediaJson);
    
    var mapOptions = {
        zoom: <?php print $_GET['zoom']; ?>,
        center: new google.maps.LatLng(<?php print $_GET['lat']; ?>, <?php print $_GET['lon']; ?>),
        disableDefaultUI: true,
        streetViewControl: false,
        panControl: true,
        panControlOptions: {
            position: google.maps.ControlPosition.LEFT_TOP
        },
        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.SMALL,
            position: google.maps.ControlPosition.LEFT_TOP
        },

        mapTypeId: google.maps.MapTypeId.HYBRID,
    };

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    google.maps.event.addDomListener(map, 'tilesloaded', function(){
        if($('#newPos').length==0){
            $('div.gmnoprint').last().parent().wrap('<div id="newPos" />');
            $('div.gmnoprint').fadeIn(500);
        }
    });

    var setPos = function(){
        google.maps.event.trigger(map, 'tilesloaded');
    };
    //  window.setTimeout(setPos,1000);
}


google.maps.event.addDomListener(window, 'load', initialize);

    
  </script>
  </head>
  <body>
<div id="container"></div>
  <div id="map-canvas"></div>
      <div id="map_info_panel" class="info_popup">
        <p class="tweet-name">
          <span id="tweet_name"> </span>
        </p>   
      <div id="info_popup_content">
        Loading the most recent media <br>
        feed from Geofeedia...
      </div>
      <div id="info_popup_nav">
        <a id="info_next_btn" class="info_next_btn" onclick="next();"></a>
        <a id="info_prev_btn" class="info_prev_btn" onclick="prev();"></a>
        <p class="tweet-time">          
        <span id="tweet_time"> </span>
        </p>
      </div>
    </div>
  </body>
</html>