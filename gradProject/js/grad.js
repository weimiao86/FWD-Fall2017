//vars
var istoggled = true;

//functions
$(document).ready(function(){
  $("#query_section").show();
  $("#queryToggle").click(function(){
    $("#query_section").slideToggle();
    switchIcon();
  });
  $("#queryForm").submit(function(event) {
    event.preventDefault();
    $("#query_section").slideToggle();
    switchIcon();
    drawLineChart();
  });
});

function switchIcon(){
  istoggled = !istoggled;
  if(istoggled){
    $("#tIcon").removeClass("fa-angle-double-down");
    $("#tIcon").addClass("fa-angle-double-up");
  }else{
    $("#tIcon").removeClass("fa-angle-double-up");
    $("#tIcon").addClass("fa-angle-double-down");
  }
}

//gngerate random color
function randomColor(){
  var r = Math.round(Math.random() * 255);
  var g = Math.round(Math.random() * 255);
  var b = Math.round(Math.random() * 255);
  return "rgba(" + r + ","+g+","+b+","+"0.8)";
}

function drawLineChart(){
  // helper to format timestamp data
  Date.prototype.formatHHMM = function() {
      return this.getHours() +
      ":" +  this.getMinutes();
  }

var fromDate = $("#dataFrom").val();
var toDate = $("#dataTo").val();
var fields = [];
$.each($("input[name='pvboard']:checked"), function(){
  fields.push($(this).val());
});

var queryStr = "SELECT data_date, " +fields.join(',')+ " from pvdata where combinerbox='S35-NBA-HL04' and data_date between" + " '"+ fromDate +"' "+"and"+" '"+ toDate +"' ";
//query database
  var jsonData = $.ajax({
    type: 'POST',
    url: '/query',
    //data: JSON.stringify(data),
    data: {
      qstr:queryStr
    },
    dataType: 'json'
  }).done(function (results) {
    //console.log(results);
    // Split timestamp and data into separate arrays
    var labels = [];
    $.each(JSON.parse(results), function(key, item){
      labels.push(new Date(item.data_date).formatHHMM());
    });

    var len = fields.length;
    var chartData = [];
    var datasets = [];
    for(i=0; i<len; i+=1){
      var tempArr = [];
      var fieldNb = fields[i].toString();
      $.each(JSON.parse(results), function(key, item){
        tempArr.push(parseFloat(item[fieldNb]));
      });
      chartData.push(tempArr);
      var fieldLine = {
        label: fields[i],
        fill: false,
        borderColor : randomColor(),
        borderWidth: 1,
        pointRadius: 0,
        data: chartData[i]
      };
      datasets.push(fieldLine);
    }
    // console.log(fields.join(','));
    //console.log(chartData);
    // console.log(datasets.join(','));
    var analysisData = [];
    for(j=0;j<chartData[0].length;j++){
      var sum1 = 0;
      for(k=0;k<len;k++){
        sum1 += chartData[k][j];
      }
      var avg = sum1/len;
      var sum2=0;
      for(m=0;m<len;m++){
        sum2+=(chartData[m][j]-avg)*(chartData[m][j]-avg);
      }
      sum2=sum2/(len-1);
      var stv = Math.sqrt(sum2);
      analysisData.push(stv);
    }
  
    // Create the chart.js data structure using 'labels' and 'data'
    var rawData = {
      labels : labels,
      datasets: datasets
    };

    var analysisDataSet={
      labels:labels,
      datasets: [{
        label: "Standard Deviation",
        fill: false,
        borderColor : randomColor(),
        borderWidth: 1,
        pointRadius: 0,
        data: analysisData
      }]
    };

    var options = {
      responsive: true,
      scales: {
          yAxes: [{
              ticks: {
                  beginAtZero:true
              },
              scaleLabel: {
                   display: true,
                   labelString: 'Current(A)',
                   fontSize: 16
                }
          }],
          xAxes: [{
              time: {
                  unit: 'minute'
              }
          }]
        },
      };

    // Get the context of the canvas element we want to select
    var ctx = document.getElementById("rawLineChart").getContext("2d");
    var ctx2 = document.getElementById("avgLineChart").getContext("2d");
    var rawDataLineChart = new Chart(ctx,{
      type:'line',
      data:rawData,
      options: options
    });
    var analysisDataLineChart = new Chart(ctx2,{
      type:'line',
      data:analysisDataSet,
      options: options
    });
  });
}
