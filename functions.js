var map, google, jsonItems, navId, oldIcon, lastSelected, allMarkers = [];
var url = "https://api.geofeedia.com/v1/search/collection/11263?appId=715505bb&appKey=cdb5927a7561bc1323e2442e465d1a2d";
var spritePath = "css/images/sprite-main.png";
function convertTime(rawDate) {
    //The time of a media post is available through the API (.publishDate) in GMT 
    //this function then uses MomentJS to get the time from the local user's computer, including GMT offset
    //The offset is then used to convert the media post time (in GMT), to the user's local time
    "use strict";
    var objLocalZone, strLocalZone, hhmmOffset, plusMinus, time;
    objLocalZone = new Date();
    strLocalZone = '' + objLocalZone;
    hhmmOffset = strLocalZone.substring(29, 33);
    plusMinus = strLocalZone.substring(28, 29);
    if (plusMinus === "+") {
        plusMinus = "-";
        hhmmOffset = plusMinus + hhmmOffset;
    } else if (plusMinus === "-") {
        plusMinus = "+";
        hhmmOffset = plusMinus + hhmmOffset;
    } else {
        console.log("Date is not in expected format");
        console.log(plusMinus);
    }
    rawDate = rawDate.substring(0, 19) + hhmmOffset;
    time = moment.utc(rawDate).format("dddd h:mm a");
    return time;
}

function determineMediaNum(mediaSource) {
    "use strict";
    var num, sprite, hlSprite;
    if (mediaSource === "twitter") {
		sprite = 317;
		hlSprite = 122;
    } else if (mediaSource === "instagram") {
		sprite = 278;
		hlSprite = 83;
    } else if (mediaSource === "picasa") {
		sprite = 239;
		hlSprite = 44;
    } else if (mediaSource === "flickr") {
		sprite = 200;
		hlSprite = 5;
    } else if (mediaSource === "youtube") {
		sprite = 356;
		hlSprite = 161;
    } else if (mediaSource === "viddy") {
		sprite = 593;
		hlSprite = 553;
    } else if (mediaSource === "facebook") {
        sprite = 434;
        hlSprite = 395;
    } else {
        console.log("This is a new or misinterpreted media type.  Defaulting to Instagram settings, please consult map admin");
		sprite = 278;
		hlSprite = 83;
    }
    return [sprite, hlSprite];
}

function crawlForImages(theObject) {
	"use strict";
    var pathEnd;
	var string;
    var altString;
    if (theObject.source === "facebook") {
            if (theObject.mediaItems['0'] === undefined) {
                string = theObject.title;
                pathEnd = "<img src=" + string + 'onerror="imgError(this);"/>';
            } else {
                string = JSON.stringify(theObject.mediaItems['0'].media['1'].standard_resolution.url);
                altString = JSON.stringify(theObject.title);
                pathEnd = "<img src=" + string + "alt =" + altString + "/>";
            } } 
    else if (theObject.source === "twitter") {
    		if (theObject.mediaItems['0'] === undefined) {
    			string = theObject.title;
    			pathEnd = "<img src=" + string + 'onerror="imgError(this);"/>';
    		} else {
    			string = JSON.stringify(theObject.mediaItems['0'].media['0'].standard_resolution.url);
    			altString = JSON.stringify(theObject.title);
                pathEnd = "<img src=" + string + "alt =" + altString + "/>";
    		} } 
    else if (theObject.source === "instagram") {
        string = JSON.stringify(theObject.mediaItems['0'].media['1'].low_resolution.url);
        altString = JSON.stringify(theObject.title);
		pathEnd = "<img src=" + string + "alt =" + altString + "/>";
	} 
    else if (theObject.source === "picasa") {
		string = JSON.stringify(theObject.mediaItems['0'].media['0'].standard_resolution.url);
		altString = JSON.stringify(theObject.title);
        pathEnd = "<img src=" + string + "alt =" + altString + "/>";
	} else if (theObject.source === "flickr") {
		string = JSON.stringify(theObject.mediaItems['0'].media['0'].standard_resolution.url);
		altString = JSON.stringify(theObject.title);
        pathEnd = "<img src=" + string + "alt =" + altString + "/>";
	} else if (theObject.source === "youtube") {
		string = JSON.stringify(theObject.mediaItems['0'].media['1'].iframe_src_url.url);
		altString = JSON.stringify(theObject.title);
        pathEnd = '<iframe width="100%" height="100%" src=' + string + 'alt=' + altString + '></iframe>';
	} else if (theObject.source === "viddy") {
		string = JSON.stringify(theObject.mediaItems['0'].media['0'].standard_resolution.url);
		altString = JSON.stringify(theObject.title);
        pathEnd = '<iframe width="100%" height="100%" src=' + string + 'alt=' + altString + '></iframe>';
	} else {
		console.log("This is a new or misinterpreted media type.  Defaulting to Instagram settings, please consult admin");
		string = JSON.stringify(theObject.mediaItems['0'].media['1'].low_resolution.url);
		altString = JSON.stringify(theObject.title);
        pathEnd = "<img src=" + string + "alt =" + altString + "/>";
	}
	if (pathEnd === undefined) {
		string = theObject.title + 'onerror="imgError(this);"/>';
		pathEnd = "<src=" + string;
	}
return pathEnd;
}

function loadIndexData(jsonItems, navId) {
    "use strict";
    var indxImgLink, indxConvertedTime;
    if (jsonItems[navId].mediaItems["0"] === undefined) {
        document.getElementById("info_popup_content").innerHTML = '<div class="tweet-text">' + jsonItems[navId].title + '</div>';
    } else {
        indxImgLink = crawlForImages(jsonItems[navId]);
        document.getElementById("info_popup_content").innerHTML = indxImgLink;
    }
    document.getElementById("tweet_name").innerHTML = "By&nbsp;" + jsonItems[navId].author.name;
    indxConvertedTime = convertTime(jsonItems[navId].publishDate);
    document.getElementById("tweet_time").innerHTML = indxConvertedTime;
    map.panTo(new google.maps.LatLng(jsonItems[navId].latitude, jsonItems[navId].longitude));
}

function loadLocationData(jsonItems) {
    "use strict";
    var x, myPin, myId, mediaNums, linkEnd, convertedTime, mediaObject, pinTitle, infowindow, location, marker, mediaCheck;
    for (x in jsonItems) {
        myPin = jsonItems[x];
		myId = parseInt(x);
        mediaObject = myPin.mediaItems["0"];
		mediaNums = determineMediaNum(myPin.source);
		linkEnd = crawlForImages(myPin);
		convertedTime = convertTime(myPin.publishDate);
        pinTitle = myPin.title;
        location = new google.maps.LatLng(myPin.latitude, myPin.longitude);
        marker = new google.maps.Marker({
            position: location,
            map: map,
            author: myPin.author.name,
            source: myPin.source,
            publishDate: myPin.publishDate,
            publishTime: convertedTime,
            mediaPreview: mediaObject,
            tweetTitle: pinTitle,
            link: linkEnd,
			pinIndex: myId, 
            icon: new google.maps.MarkerImage(
				spritePath,
				new google.maps.Size(29, 42),
				new google.maps.Point(mediaNums['0'], 305),
				new google.maps.Point(0, 0)
				),
        });
        allMarkers.push(marker);
        infowindow = new google.maps.InfoWindow({
        });
        google.maps.event.addListener(marker, "click", function () {
            infowindow.setContent();
            navId = this.pinIndex;
            mediaCheck = JSON.stringify(this.mediaPreview);
            document.getElementById("tweet_name").innerHTML = "By&nbsp;" + this.author;
            document.getElementById("tweet_time").innerHTML = this.publishTime;
            if (mediaCheck === undefined) {
                document.getElementById("info_popup_content").innerHTML = '<div class="tweet-text">' + this.tweetTitle + '</div>';
            } else {
                document.getElementById("info_popup_content").innerHTML = this.link;
            }
         //   map.panTo(this.getPosition());  //un-comment if you'd like icon clicks to pan to clicked icon
            infowindow.open();
            highlightController(allMarkers, navId, jsonItems);
        });
        }
}

function highlightController (allMarkers, navId, jsonItems) {
"use strict";
var highlightThisMarker, markerHolder, hlSprite; 
	highlightThisMarker = findMarker(allMarkers, navId);
	hlSprite = determineMediaNum(highlightThisMarker.source);
	markerHolder = highlightThisMarker;
    if (oldIcon === undefined) {
        lastSelected = markerHolder;
        oldIcon = lastSelected.icon;
    } else {
        lastSelected.setIcon(oldIcon);
        lastSelected.setZIndex(google.maps.Marker.MIN_ZINDEX);
        lastSelected = markerHolder;
        oldIcon = lastSelected.icon;             
    }
    highlightThisMarker.setIcon(new google.maps.MarkerImage(
		spritePath,
		new google.maps.Size(29, 42),
		new google.maps.Point(hlSprite['1'], 305),
		new google.maps.Point(0, 0)
		//new google.maps.Size(size, size) // no need to scale the icons
		)); 
    highlightThisMarker.setZIndex(google.maps.Marker.MAX_ZINDEX + 1);     
}

function findMarker(allMarkers, navId) {
    for (var i=0; i<allMarkers.length; i++) {
        if (allMarkers[i].pinIndex == [navId]) {
        return allMarkers[i];
        } 
    }
}

function imgError(image) {
    "use strict";
    console.log(image);
    image.onerror = "";
    image.src = image;
    return true;
}

function next() {
    "use strict";
   if (navId < 1){
    buttonStyle(navId);
    //console.log(navId);
    loadIndexData(jsonItems, navId);
    highlightController(allMarkers, navId, jsonItems);
    }
    else {
    navId = navId-1;
    //console.log(navId);  //NaN is expected on first click;
    buttonStyle(navId);
    loadIndexData(jsonItems, navId);   
    highlightController(allMarkers, navId, jsonItems);
    }
}

function prev() {
    "use strict";
    if (navId > jsonItems.length - 2) {
        buttonStyle(navId);
        loadIndexData(jsonItems, navId);       
        highlightController(allMarkers, navId, jsonItems);
    }
    else {
        navId = navId+1;
        buttonStyle(navId);
        loadIndexData(jsonItems, navId);
        highlightController(allMarkers, navId, jsonItems);
    }
}

function buttonStyle(navId) {
    "use strict";
    if (navId > jsonItems.length - 2) {
        document.getElementById("info_prev_btn").className = "info_prev_btn_gry";
        document.getElementById("info_next_btn").className = "info_next_btn";
    }
    else if (navId < 1) {
        document.getElementById("info_prev_btn").className = "info_prev_btn";
        document.getElementById("info_next_btn").className = "info_next_btn_gry";
    } else {
        document.getElementById("info_prev_btn").className = "info_prev_btn";
        document.getElementById("info_next_btn").className = "info_next_btn";
    }
}

function geofeediaJson(response) {
    "use strict";
    jsonItems = response.items;
	navId = Math.round(jsonItems.length / 2);
    loadIndexData(jsonItems, navId);
    loadLocationData(jsonItems);
    highlightController (allMarkers, navId, jsonItems);
}

function showInfo(){
    if (info_box.style.display === 'block') {
         document.getElementById('info_box').style.display = 'none';
    } else if (info_box.style.display === 'none') {
        document.getElementById('info_box').style.display = 'block';
    } else {
        document.getElementById('info_box').style.display = 'none';
    }
}

function prepGoogleAPI() {
    "use strict"
    var div = document.createElement('div');
    div.innerHTML = '<span id="logo_background"></span><a ><img id="infolinkimg" src= "css/images/info-icon.png"  onclick="showInfo();"></a><div id="info_box" style="display: none;">This live map was created <br> using Geofeedia, the pioneer <br>in real-time, location-based <br> social media monitoring.<p/> <hr> <a href="http://www.geofeedia.com">www.geofeedia.com</a><span><img id="popup_close" src="css/images/popup-close.png" onclick="showInfo();"></span> </div><a href="http://www.geofeedia.com"><img id="logo" src= "css/images/geofeedia_logo_final_white2.png"></a><a id="attribution" href="http://www.SilverleafGeospatial.com"> SilverleafGeospatial.com </a>';
     document.getElementById('container').appendChild(div);
}