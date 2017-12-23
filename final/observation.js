//vars
var database = firebase.database();
var databaseRef = database.ref();

//functions
$(document).ready(function(){
  $("#order_form").submit(function(e){
    postForm();
    e.preventDefault();
  });

  loadFirebaseData();
});

function postForm(){
  var inputName = $("#name").val()? $("#name").val() : "-";
  var inputEmail = $("#email").val()? $("#email").val() : "-";
  var inputPhone = $("#phone").val()?  $("#phone").val() : "-";
  var isAvalanche = $('input[name=avalanche]:checked').val();
  var isTrigger = $('input[name=trigger]:checked').val();
  var isCaught = $('input[name=caught]:checked').val();
  var inputLocation = $("#location").val()? $("#location").val() : "-";
  var inputDesc = $("#description").val()? $("#description").val() : "-";

  databaseRef.push({
    name: inputName,
    email: inputEmail,
    phone: inputPhone,
    avalanche: isAvalanche,
    trigger:isTrigger,
    caught:isCaught,
    location:inputLocation,
    desc:inputDesc
  }).then(function(){
    console.log("Data saved to firebase");
  }).catch(function(error) {
    alert("Data could not be write to firebase." + error);
  });
}

function loadFirebaseData(){
  databaseRef.on("child_added", function(snapshot){
    console.log(snapshot.val());
    var loadName = $("<p></p>").text(snapshot.val().name);
    var loadLocation =  $("<p></p>").text(snapshot.val().location);
    var isAvalanche = $("<p></p>").text(snapshot.val().avalanche);
    var isTrigger = $("<p></p>").text(snapshot.val().trigger);
    var isCaught =  $("<p></p>").text(snapshot.val().caught);
    var loadDesc = $("<p></p>").text(snapshot.val().desc);

    $("#result_name").append(loadName);
    $("#result_location").append(loadLocation);
    $("#result_saw").append(isAvalanche);
    $("#result_trigger").append(isTrigger);
    $("#result_caught").append(isCaught);
    $("#result_desc").append(loadDesc);
  });
}
