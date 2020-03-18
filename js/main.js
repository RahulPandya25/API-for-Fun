const GOOGLE_API_KEY = "AIzaSyCw1pm6sKWgvy1OAPSpli3LDFFl3gZl4Ok";
const OpenCageData_API_KEY = "6e72fdbeeaf045828521d48ed940c47f";

// global var
var countryCode = "ca";
var marker;

function executeYTquery(vidCatId) {
  var request;
  // create request
  if (vidCatId === "-1")
    request = gapi.client.youtube.search.list({
      part: "snippet",
      type: "video",
      chart: "mostPopular",
      regionCode: countryCode,
      maxResults: 10,
      order: "viewCount",
      publishedAfter: "2020-02-01T00:00:00Z"
    });
  else if (vidCatId > 0)
    request = gapi.client.youtube.search.list({
      part: "snippet",
      type: "video",
      chart: "mostPopular",
      regionCode: countryCode,
      videoCategoryId: vidCatId,
      maxResults: 10,
      order: "viewCount",
      publishedAfter: "2020-02-01T00:00:00Z"
    });

  // getting YT response
  request.execute(function(response) {
    var results = response;
    $(".yt-videos").html("");
    $.each(results.items, function(index, item) {
      $(".yt-videos").append(
        '<div class="item"><iframe class="item-vid" src="//www.youtube.com/embed/' +
          item.id.videoId +
          '" frameborder="0" allowfullscreen></iframe><div class="item-title">' +
          item.snippet.title +
          "</div></div>"
      );
    });
  });
}

// new yt instance - gapi client
function init() {
  gapi.client.setApiKey(GOOGLE_API_KEY);
  gapi.client.load("youtube", "v3", function() {});
}

// new google map instance
function initMap() {
  // map options - setting zoom as 4 and Toronto as center
  var options = {
    zoom: 4,
    center: { lat: 43.6532, lng: -79.3832 }
  };

  // new map instance
  var map = new google.maps.Map(document.getElementById("map"), options);

  // placing marker
  marker = new google.maps.Marker({
    position: { lat: 43.6532, lng: -79.3832 },
    map: map
  });

  // event listener - click on map
  google.maps.event.addListener(map, "click", function(event) {
    // remove previous
    marker.setMap(null);

    // place marker
    marker = new google.maps.Marker({
      position: event.latLng,
      map: map
    });

    // get country code from lat-lan
    axios
      .get(
        "https://api.opencagedata.com/geocode/v1/json?q=" +
          event.latLng.toUrlValue(6) +
          "&key=" +
          OpenCageData_API_KEY +
          "&language=en&pretty=1"
      )
      .then(response => {
        //   update county label
        var country = response.data.results[0].components.country;
        document.getElementById("country-name").innerHTML = country;
        //   update country code
        countryCode = response.data.results[0].components.country_code.toUpperCase();
        //   execute YT query
        executeYTquery("-1");

        // removing active class of vid cat
        var current = document.getElementsByClassName("active");
        if (current.length > 0) {
          current[0].className = current[0].className.replace(" active", "");
        }
      });
  });
}

// updating active class list of vid cat
var btns = document.getElementsByClassName("nav-links");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function() {
    var current = document.getElementsByClassName("active");
    if (current.length > 0) {
      current[0].className = current[0].className.replace(" active", "");
    }
    this.className += " active";
  });
}

(function automaticFunction() {
  setTimeout(function() {
    // first req to yt
    executeYTquery("-1");
  }, 3000);
})();
