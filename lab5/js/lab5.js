////////////////vars//////////////////
var database = firebase.database();
var databaseRef = database.ref();
var userdataRef = null;
//var storageRef = firebase.storage();
var provider = new firebase.auth.GoogleAuthProvider();
var current_user = null;
var current_uid = null;


/////////////functions/////////////////
$(document).ready(function() {
  $("#upload_prgs").hide();
  //setInterval(update_gallery(), 300);
  //login and out
  $("#login").click(authenticate);
  $("#logout").click(signOut);
  //upload file
  $("#upload_btn").click(function() {
    if (current_user) {
      var description = $("#imgDesc").val();
      var file = $("#choose_file").prop('files')[0];
      if (description != "" && file != null) {
        upload_file();
      } else {
        alert("Please choose a file add a description to upload!");
      }
    } else {
      alert("Please sign in to upload your image!");
    }
  });
});

//upload file to storage
function upload_file() {
  var file = $("#choose_file").prop('files')[0];
  var time_now = $.now();
  var storageRef = firebase.storage().ref('img/' + time_now + file.name);
  var task = storageRef.put(file);
  task.on('state_changed', function progress(snapshot) {
    var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    $("#upload_prgs").show();
    $("#upload_prgs").val(percentage);

  }, function error(err) {
    console.log(err);
  }, function complete() {
    var downloadURL = task.snapshot.downloadURL;
    console.log(downloadURL);
    pushImgData(downloadURL);
    $("#upload_prgs").hide();
  });
}
//save image data to database
function pushImgData(url) {
  var timestamp = $.now();
  var imgURL = url;
  var imgDesc = $("#imgDesc").val();
  userdataRef.push({
    timestamp: timestamp,
    url: imgURL,
    description: imgDesc
  });
  $("#imgDesc").val("");
  //console.log("done writing data to user info");
}

//login
function authenticate() {
  firebase.auth().signInWithPopup(provider).then(function(result) {
    if (result.credential) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
    } else {
      //google sign-in redirect
      firebase.auth().signInWithPopup(provider);
    }
    // The signed-in user info
    //var user = result.user;
    current_user = result.user;
    current_uid = result.user.uid;
    // console.log(result.user.displayName);
    // console.log(result.user.uid);
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
  });
}

function signOut() {
  firebase.auth().signOut().then(function() {
    // Sign-out successful
    current_user = null;
    $("#image_section").empty();
    $("#user_info").text("Plese sign in");
  }).catch(function(error) {
    // An error happened
  });
}

//setting an event listener for change of authentication state
firebase.auth().onAuthStateChanged(function(user) {
  current_user = user;
  if (user) {
    // User is signed in
    current_uid = user.uid;
    userdataRef = firebase.database().ref('usersImg/' + current_uid);
    //console.log(current_uid);
    $("#user_info").text("Hi, " + user.displayName);
    //Adds an event listener to any child added
    userdataRef.on("child_added", function(snapshot) {
      //console.log(snapshot.val());
      var img_url = snapshot.val().url;
      var img_dsc = snapshot.val().description.toString();
      console.log(img_dsc);

      //add image
      var img_div = "<div class = 'gallery'>" +
        "<a target='_blank' href=" + img_url + ">" +
        "<img src =" + img_url + ">" + "</a>" +
        "<p class='img_dscp'>" +
        img_dsc +
        "</p>" +
        "</div>";
      $("#image_section").prepend(img_div);
    });
  } else {
    // No user is signed in
    $("#user_info").text("Plese sign in");
    current_uid = null;
    userdataRef = null;
  }
});
