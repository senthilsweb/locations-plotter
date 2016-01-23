var locCalc = require('./LocationCalculator');
var Client = require('node-rest-client').Client;
var _ = require("underscore");
var json2xls = require('json2xls');
var fs = require('fs');

var inputLat = "12.978328";
var inputLon = "77.571974";
var distBetweenBillboardsInMeters = "1000"

var mock_data_limit = "72"; //Max number of data to be generated
//API Explorer : https://www.flickr.com/services/api/explore/flickr.photos.search
var flickr_api_endpoint = "https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&nojsoncallback=1";
var flickr_api_key = "5f6f737069edcb2b00938b4bdc384458"; //The api key used here is timebound hence copy new one everytime when you run this program from the above link. 
var flickr_search_tags = "murals";
var flickr_search_text = "murals";
var flickr_search_limit = mock_data_limit;
var flickr_search_currentpage = "1";
flickr_api_endpoint = flickr_api_endpoint + "&api_key=" + flickr_api_key + "&tags=" + flickr_search_tags + "&text=" + flickr_search_text + "&per_page=" + flickr_search_limit + "&page=" + flickr_search_currentpage

var billboards = [];
var billboardPages = [];

//1) Get locations (8 plots) for a given lat & lon
var temp = locCalc.locations(inputLat, inputLon, distBetweenBillboardsInMeters);

//2) Put locations in billboards array
for (var i=0;i<temp.length;i++){billboards.push(temp[i]);}

//3) For every 8 plots, get locations (8 plots each)
for (var i=0;i<temp.length;i++){
  var response = locCalc.locations(temp[i].lat, temp[i].lon, distBetweenBillboardsInMeters);
  
  for (var j=0;j<response.length;j++){
    //3) Add to billboards array
  	billboards.push(response[j]);
  }
}
console.log("Finished computing locations");

var client = new Client();

// registering remote methods 
//With Id.
//client.registerMethod("syntheticData", "https://www.mockaroo.com/f63e1d50/download?count=" + mock_data_limit + "&key=cc1535b0", "GET");
//Without Id
client.registerMethod("syntheticData", "https://www.mockaroo.com/d4d8f120/download?count=" + mock_data_limit + "&key=cc1535b0", "GET");
 
client.methods.syntheticData(function(data,rawdata){
    console.log("Finished pulling raw synthetic data");
    _.each(data, function(item,index,list){       
         item.latitude = billboards[index].lat;
         item.longitude = billboards[index].lon;
    });
	billboards = data;
    console.log("Finished setting latitude and longitude");
    //console.log(billboards);
    
    // registering remote methods 
    client.registerMethod("flickrSearch", flickr_api_endpoint  , "GET");	
    client.methods.flickrSearch(function(res,rawdata){   
        console.log("Finished pulling flicker photos");
	     //console.log(res.photos.photo);	
         console.log("Length = [" + res.photos.photo.length + "]");
        _.each(res.photos.photo, function(item,index,list){  
            
         billboards[index].ThumbnailSource  = "http://farm" + item.farm + ".staticflickr.com/" + item.server + "/" + item.id + "_" + item.secret + "_b.jpg"; 

    });
       
       console.log("Finished setting thumbnail source");      
        var xls = json2xls(billboards);
        fs.writeFileSync('billboard_' + Math.round(+new Date()/1000).toString() + '.xlsx', xls, 'binary');
       console.log("Finished generating billboard xls file.");       
    });
});
     
     

