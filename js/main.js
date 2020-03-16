const GOOGLE_API_KEY = "AIzaSyDdezHKWzFzbCmyv-GXgWu1Lm5_db_H9gM";
const OpenCageData_API_KEY = "6e72fdbeeaf045828521d48ed940c47f";
// initial
var countryCode = "ca";
var categoryId = "";

var marker;

// for Google Map
function initMap() {
  // map options - setting zoom as 4 and Windsor as center
  var options = {
    zoom: 4,
    center: { lat: 43.6532, lng: -79.3832 }
  };

  // new map instance
  var map = new google.maps.Map(document.getElementById("map"), options);

  this.marker = new google.maps.Marker({
    position: { lat: 43.6532, lng: -79.3832 },
    map: map
  });

  // add marker on maps
  google.maps.event.addListener(map, "click", function(event) {
    console.log(event);

    // remove if exists
    if (this.marker && this.marker.setMap) {
      this.marker.setMap(null);
    }

    // place marker
    this.marker = new google.maps.Marker({
      position: event.latLng,
      map: map
    });

    axios
      .get(
        "https://api.opencagedata.com/geocode/v1/json?q=" +
          event.latLng.toUrlValue(6) +
          "&key=" +
          OpenCageData_API_KEY +
          "&language=en&pretty=1"
      )
      .then(response => {
        console.log(response.data.results[0].components);
      })
      .catch(err => {
        console.log(err);
      });
  });
}
