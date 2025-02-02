
var path = [];
let colorpath;
let name_agl;
function initialize() {

}
const map = new google.maps.Map(document.getElementById("map"), {
  zoom: 15,
  //center: {lat: 34.97674876512191, lng: 117.82601481119},,   
  center: { lat: 34.979977081647554 , lng:  43.362018079789166},
  gestureHandling: 'greedy',
  mapTypeId: google.maps.MapTypeId.SATELLITE//satellite..ROADMAP..SATELLITE
});


  google.maps.event.addDomListener(window, 'load', initialize);
  google.maps.event.addListener(map, 'rightclick', function(event) {
    getCoordinates(event.latLng);
  });
  if (navigator.geolocation) {
    var marker;
    navigator.geolocation.watchPosition(function(position) {
      var currentLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      map.setCenter(currentLocation);

      // Add or update the marker for the current location
      if (!marker) {
        marker = new google.maps.Marker({
          position: currentLocation,
          map: map,
          title: 'Current Location'
        });
      } else {
        marker.setPosition(currentLocation);
      }
    }, function() {
      console.error('Error getting location');
    });
  } else {
    console.error('Geolocation not supported by this browser.');
  }
  function getTextareaRowNumber() {
    path=[];
    var array=[];
     let startpos;
     colorpath=document.getElementById("favcolor").value;
     name_agl =document.getElementById("name_agl").value;
    // Get the textarea's value
    const textareaValue = document.getElementById("story").value;
  
    // Split the value into lines based on newline characters
    const lines = textareaValue.split('\n');
  
    // Get the cursor position
    const cursorPosition = document.getElementById("story").selectionStart;
  
    // Find the row number by iterating through the lines and counting the characters
    let rowNumber = 1;
    let currentPosition = 0;
    for (let i = 0; i < lines.length; i++) {
      array.push(lines[i])
    }
  
  
  // Function to parse coordinates from string format
 
  var pathMarker=[];
  let sumx=0;
  let sumy=0;
  for (var i = 0; i < array.length; i++) {
      // split this array element into another array, delimited on the *
      var subluxian = array[i].split("*");
      for (var j = 0; j < subluxian.length; j++) {
          // now split it into the lat and lng
          var coords = subluxian[j].split(",");
          // add the coords into the path
          pathMarker.push(coords[1]+" , "+coords[0]);
          const longlatpoint=  utmtoLog(coords[0],coords[1]);
          sumx+=longlatpoint[0];
          sumy+=longlatpoint[1];
          path.push(new google.maps.LatLng(parseFloat(longlatpoint[1]), parseFloat(longlatpoint[0])));
      }
       
  }
  map.setCenter(path[0]);
  const line = new google.maps.Polygon({
      path: path,
      strokeColor: colorpath,
      geodesic: true, 
      strokeOpacity: 1.0,
      strokeWeight: 2,
      geodesic: true,
      fillColor: colorpath,         // Fill colour  
      fillOpacity: 0.35 
  });
line.setMap(map);

for(let i =0;i<=path.length/2+1;i++){
 // Position it in the middle of the polyline  
var labelPosition = path[i]; 
var labeltext= pathMarker[i];
// Create a marker with the label  
var labelMarker = new google.maps.Marker({  
    position: labelPosition,  
    map: map,  
    label: {  
        text: "("+labeltext+")",  
        color: colorpath,  
        fontSize: "12px",  
        fontWeight: "normal"  
    }  
}); 
if(i===0){
  var positionm = new google.maps.LatLng(sumy/path.length,sumx/path.length); // where lat and lng are valid numbers  

var labelMarker2 = new google.maps.Marker({  
  position: positionm,  
  map: map,  
  label: {  
      text: name_agl,  
      color: colorpath,  
      fontSize: "12px",  
      fontWeight: "normal"  
  }  
}); 
}
}

     const area = google.maps.geometry.spherical.computeArea(path);
     const distance=[]; 
     for(let i=0;i<path.length;i+=2 ){
      distance.push(google.maps.geometry.spherical.computeDistanceBetween(path[i], path[i+1]));  
      }
     addDatatotage(distance,area);
}

  document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('print');
    const button2 = document.getElementById("GO");
   
    if (button) {
      button.addEventListener('click',   
   () => {
        console.log('Button clicked!');
      });
    } else {
      console.error('Button element not found.');
    }

    if (button2) {
      button2.addEventListener('click',   
() => {
        getTextareaRowNumber();
      });
    } else {
      console.error('Button element not found.');
    }


  });
  function getCoordinates(latLng) {
    var lat = latLng.lat();
    var lng = latLng.lng();
    //console.log('Latitude: ' + lat + ', Longitude: ' + lng);
    var utmProjection = '+proj=utm +zone=38 +datum=WGS84 +units=m +no_defs';
    var utmCoordinates = proj4('EPSG:4326', utmProjection, [lng, lat]);
    var utmLabel = document.getElementById('gpsutmdata');
    utmLabel.textContent = 'Easting: ' + utmCoordinates[0].toFixed(2) + ', Northing: ' + utmCoordinates[1].toFixed(2);
    // You can also display the coordinates in an HTML element or use them as needed
  }
  function getRadioValue() {  
    const selectedRadio = document.querySelector('input[name="fav_language"]:checked');  
    if (selectedRadio) {  
        const value = selectedRadio.value;  
        map.setMapTypeId(value);
        console.log("Selected value: " + value);  
        // You can also handle the value as necessary  
    } else {  
        console.log("No option selected.");  
    }  
}
function addDatatotage(point,areadata){
  console.log("length-"+point.length);
  for(let i=0;i<point.length;i++){
  const tag = document.createElement('H5');  
  tag.textContent = (point[i]).toFixed(2)+"     :"+(i+1)+" النقطة :";   
  tag.className = 'tag';  
  tag.style.margin = '5px';
  document.getElementById('showdata').appendChild(tag);
}
  const tagarea = document.createElement('label');  
  tagarea.textContent = areadata.toFixed(2)/2500+"   :"+"المساحة الكلية";   
  tagarea.className = 'tag2';  
  tagarea.style.margin = '5px';
  document.getElementById('showdata').appendChild(tagarea);  
}

function utmtoLog(easting,northing){
  proj4.defs('EPSG:32638', '+proj=utm +zone=38 +ellps=WGS84 +datum=WGS84 +units=m +no_defs'); // UTM zone 38
  proj4.defs('EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs'); // WGS84
  const utmCoords = [Number(easting), Number(northing)]; // Example UTM coordinates
  const latLngCoords = proj4('EPSG:32638', 'EPSG:4326', utmCoords);
  return latLngCoords;
 }
   

