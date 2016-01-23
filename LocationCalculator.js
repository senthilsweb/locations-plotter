
/*
REFERENCES:
http://www.igismap.com/haversine-formula-calculate-geographic-distance-earth/
http://www.igismap.com/formula-to-find-bearing-or-heading-angle-between-two-points-latitude-longitude/#arvlbdata
http://stackoverflow.com/questions/2187657/calculate-second-point-knowing-the-starting-point-and-distance
http://www.geomidpoint.com/latlon.html
*/
module.exports = {
  locations: function (inputLat, inputLon, distInMet) { 
 
var degToRad = Math.PI /180;
var diffForLat = 111320 ;
var diffForLon = 110540;
var arrBearingAngles = [45,90,135,180,225,270,315,360];
var locations = [];

for (var i=0;i<arrBearingAngles.length;i++){
  var dx =  distInMet * Math.cos(arrBearingAngles[i] * degToRad);
  var dy =  distInMet * Math.sin(arrBearingAngles[i] * degToRad);
  var delta_longitude = dx/(diffForLat*Math.cos(inputLat)) 
  var delta_latitude = dy/diffForLon
  var resultLat = parseFloat(inputLat) + parseFloat(delta_latitude)
  var resultLon = parseFloat(inputLon) + parseFloat(delta_longitude)
  locations.push({"lat" : resultLat, "lon" : resultLon}); 
}

return locations

}
}

