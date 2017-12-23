
$(document).ready(function(){
  $.ajax({
    url: "http://api.aerisapi.com/observations/whitefish,mt?client_id=X047cFVPdvz0qIAPEtA8N&client_secret=wlapsUI7AerheB76NFcA8cGxVPIzN3lhxTOYFO1f",
    dataType: "json",
    success: function(json) {
      if (json.success == true) {
        var lo =  json.response.place;
        var ob = json.response.ob;

        var locations = lo.name+","+lo.state;
        $("#locationDiv").append(locations);
        $("#weatherDiv").append(ob.weather.toLowerCase());
        $("#tempDiv").append(ob.tempF + '°');
        $("#preDiv").append(ob.precipIN+"in");
      } else {
        console.log('An error occurred: ' + json.error.description);
      }
    }
  });
});
