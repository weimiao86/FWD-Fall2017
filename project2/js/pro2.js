// vars
var userInofRef = null;
var jobInfoRef = null;
var googleProvider = new firebase.auth.GoogleAuthProvider();
var facebookProvider = new firebase.auth.FacebookAuthProvider();
var twitterProvider = new firebase.auth.TwitterAuthProvider();
var current_user = null;
var current_username = null;
var current_uid = null;
var isNewjob = false;
//functions
$(document).ready(function() {
  $("#signOutBtn").hide();
  //init user login
  initUserInfo();
  //sign out
  $("#signOutBtn").click(signOut);
  //sign in
  $("#pwdSignIn").click(pwdAuthenticate);
  //register
  //$("#pwdCreate").click(pwdRegister);
  $("#registerForm").submit(function(event) {
    event.preventDefault();
    pwdRegister();
  });
  //google authentication
  $("#googleBtn").click(googleAthenticate);
  $("#facebookBtn").click(facebookAthenticate);
  $("#twitterBtn").click(twitterAthenticate);
  //add job application
  $("#toAppAdd").on("click", function() {
    addButtonClicked("toAppAdd");
  });

  $("#appedAdd").on("click", function() {
    addButtonClicked("appedAdd");
  });

  $("#olIntAdd").on("click", function() {
    addButtonClicked("olIntAdd");
  });

  $("#osIntAdd").on("click", function() {
    addButtonClicked("osIntAdd");
  });

  $("#rjctAdd").on("click", function() {
    addButtonClicked("rjctAdd");
  });

  $("#offerAdd").on("click", function() {
    addButtonClicked("offerAdd");
  });

  // list view
  $("#comToApply").on("click", "li", function() {
    isNewjob = false;
    $("#appDeleteBtn").show();
    //alert($(this).text());
    var jobdesc = $(this).text();
    var refs = jobdesc.split("-");
    var companyRef = refs[0];
    var postionRef = refs[1];
    jobListClicked("comToApply");
    manageJob(companyRef, postionRef);
  });
  $("#comApplied").on("click", "li", function() {
    isNewjob = false;
    $("#appDeleteBtn").show();
    var jobdesc = $(this).text();
    var refs = jobdesc.split("-");
    var companyRef = refs[0];
    var postionRef = refs[1];
    jobListClicked("comApplied");
    manageJob(companyRef, postionRef);
  });
  $("#comOnline").on("click", "li", function() {
    isNewjob = false;
    $("#appDeleteBtn").show();
    var jobdesc = $(this).text();
    var refs = jobdesc.split("-");
    var companyRef = refs[0];
    var postionRef = refs[1];
    jobListClicked("comOnline");
    manageJob(companyRef, postionRef);
  });
  $("#comOnsite").on("click", "li", function() {
    isNewjob = false;
    $("#appDeleteBtn").show();
    var jobdesc = $(this).text();
    var refs = jobdesc.split("-");
    var companyRef = refs[0];
    var postionRef = refs[1];
    jobListClicked("comOnsite");
    manageJob(companyRef, postionRef);
  });
  $("#comRejected").on("click", "li", function() {
    isNewjob = false;
    $("#appDeleteBtn").show();
    var jobdesc = $(this).text();
    var refs = jobdesc.split("-");
    var companyRef = refs[0];
    var postionRef = refs[1];
    jobListClicked("comRejected");
    manageJob(companyRef, postionRef);
  });
  $("#comOffered").on("click", "li", function() {
    isNewjob = false;
    $("#appDeleteBtn").show();
    var jobdesc = $(this).text();
    var refs = jobdesc.split("-");
    var companyRef = refs[0];
    var postionRef = refs[1];
    jobListClicked("comOffered");
    manageJob(companyRef, postionRef);
  });

  //radio button change
  $("input[name=jobStatusRadio]:radio").change(function() {
    //alert($(this).val());
    var radioValue = $(this).val();
    radioButtonClicked(radioValue);
  });
  //app management form submit
  $('#appManageForm').submit(function(event) {
    event.preventDefault();
    submitJob();
    refreshJob();
    $("#appManageModal").modal('toggle');
  });
  //delete job application
  $("#appDeleteBtn").click(deleteJob);

  //upload document
  $("#doc_upload").click(function() {
    if (current_user) {
      $("#progressBarContainer").hide();
      $("#doc_uploadModal").modal('toggle');
    } else {
      alert("Please sign in first");
    }
  });

  $("#upload_btn").click(uploadDoc);

  //chang profile image
  $("#userImg").click(triggerProfileImg);
  $("#choose_profileImg").change(changProfileImg);

  //delete documents
  $("#documents").on('click', '.docDelete', function() {
    var doc_id = $(this).val().toString();
    //alert(doc_id);
    deleteDocument(doc_id);
  });


});
//end document ready ================================

function deleteDocument(doc_id) {
  var doc_ref = firebase.database().ref('doc/' + current_uid);
  doc_ref.once('value').then(function(snapshot) {
    snapshot.forEach(function(child) {
      var id = child.val().id;
      if (id == doc_id) {
        child.ref.remove(function(error) {
          if (error) {
            console.log("remove doc failed: " + error);
          } else {
            console.log("document removed");
            refreshDoc();
          }
        });
      }
    });
  });
}

//chang profile image
function triggerProfileImg() {
  $("#choose_profileImg").trigger('click');
}

function changProfileImg() {
  var profileImg = $("#choose_profileImg").prop('files')[0];
  var imgName = profileImg.name;
  var storageRef = firebase.storage().ref('profileImg/' + current_uid + '/' + imgName);
  var task = storageRef.put(profileImg);
  task.on('state_changed', function progress(snapshot) {
    //upload in progress
  }, function error(err) {
    console.log(err);
  }, function complete() {
    var profileImgURL = task.snapshot.downloadURL;
    console.log(profileImgURL);
    firebase.database().ref('users/' + current_uid).update({
      photoURL: profileImgURL
    }).then(function() {
      console.log("profile image update successfully.");
      updateUserProfile();
    }).catch(function(error) {
      console.log("profile image update failed.");
    });
  });
}

//upload document
function uploadDoc() {
  var doc_target = $("#targetName").val();
  var doc_type = $("#doc_type_option").find(":selected").val();
  var file = $("#choose_file").prop('files')[0];
  if (doc_target == "") {
    doc_target = "notset"
  }
  var doc_name = file.name;
  var storageRef = firebase.storage().ref('doc/' + current_uid + '/' + file.name);
  var task = storageRef.put(file);
  task.on('state_changed', function progress(snapshot) {
    var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    percentage = Math.floor(percentage);
    $("#progressBarContainer").show();
    $("#progressBarContainer").val(percentage);
    $("#progress_bar").css('width', percentage + "%").attr('aria-valuenow', percentage).text(percentage + '%');
  }, function error(err) {
    console.log(err);
  }, function complete() {
    var doc_downloadURL = task.snapshot.downloadURL;
    console.log(doc_downloadURL);
    saveDocData(doc_downloadURL, doc_type, doc_target, doc_name);
  });
}

function saveDocData(downloadURL, type, target, docName) {
  var doc_url = downloadURL;
  var doc_type = type;
  var doc_target = target;
  var doc_name = docName;
  var time_now = $.now();

  firebase.database().ref('doc/' + current_uid).push({
    name: doc_name,
    downloadURL: doc_url,
    type: doc_type,
    target: doc_target,
    id: time_now
  }, function(error) {
    if (error) {
      alert("Document not be saved. " + error);
    } else {
      console.log("Document saved successfully.");
      $("#doc_uploadModal").modal('toggle');
    }
  });
}

//init userinfo
function initUserInfo() {
  firebase.auth().getRedirectResult().then(function(result) {
    if (result.credential) {
      var token = result.credential.accessToken;
    }
    // The signed-in user info.
    current_user = result.user;
    current_username = result.user.displayName;
    current_uid = result.user.uid;
    var userPhoto = result.user.photoURL;
    console.log(userPhoto);
    console.log("user logined in");

    $("#signInBtn").hide();
    $("#signOutBtn").show();
    $("#greetingName").text(current_username);
    createUserInfo(current_uid, userPhoto);
    //console.log(current_user);
    console.log(current_username);
    console.log(current_uid);
    //updateUserProfile();
    //$("#signInModal").modal('toggle');
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });
}

//radio button cliked
function radioButtonClicked(radioValue) {
  var radio_value = radioValue;
  switch (radio_value) {
    case "ToApply":
      $("#appSubmiteDiv").hide();
      $("#onlineInterviewDiv").hide();
      $("#onsiteInterviewDiv").hide();
      $("#offerDiv").hide();
      break;
    case "Applied":
      $("#appSubmiteDiv").show();
      $("#onlineInterviewDiv").hide();
      $("#onsiteInterviewDiv").hide();
      $("#offerDiv").hide();
      break;
    case "OnlineInterview":
      $("#appSubmiteDiv").show();
      $("#onlineInterviewDiv").show();
      $("#onsiteInterviewDiv").hide();
      $("#offerDiv").hide();
      break;
    case "OnsiteInterview":
      $("#appSubmiteDiv").show();
      $("#onlineInterviewDiv").show();
      $("#onsiteInterviewDiv").show();
      $("#offerDiv").hide();
      break;
    case "Rejected":
      $("#appSubmiteDiv").show();
      $("#onlineInterviewDiv").show();
      $("#onsiteInterviewDiv").show();
      $("#offerDiv").hide();
      break;
    case "Offered":
      $("#appSubmiteDiv").show();
      $("#onlineInterviewDiv").show();
      $("#onsiteInterviewDiv").show();
      $("#offerDiv").show();
      break;
    default:
      break;
  }
}

//application list clicked
function jobListClicked(listID) {
  var listId = listID;
  switch (listId) {
    case "comToApply":
      $("#appSubmiteDiv").hide();
      $("#onlineInterviewDiv").hide();
      $("#onsiteInterviewDiv").hide();
      $("#offerDiv").hide();
      break;
    case "comApplied":
      $("#appSubmiteDiv").show();
      $("#onlineInterviewDiv").hide();
      $("#onsiteInterviewDiv").hide();
      $("#offerDiv").hide();
      break;
    case "comOnline":
      $("#appSubmiteDiv").show();
      $("#onlineInterviewDiv").show();
      $("#onsiteInterviewDiv").hide();
      $("#offerDiv").hide();
      break;
    case "comOnsite":
      $("#appSubmiteDiv").show();
      $("#onlineInterviewDiv").show();
      $("#onsiteInterviewDiv").show();
      $("#offerDiv").hide();
      break;
    case "comRejected":
      $("#appSubmiteDiv").show();
      $("#onlineInterviewDiv").show();
      $("#onsiteInterviewDiv").show();
      $("#offerDiv").hide();
      break;
    case "comOffered":
      $("#appSubmiteDiv").show();
      $("#onlineInterviewDiv").show();
      $("#onsiteInterviewDiv").show();
      $("#offerDiv").show();
      break;
    default:
      break;
  }
}

//add button clicked
function addButtonClicked(btnID) {
  if (current_user == null) {
    alert("Please sign in first");
    return;
  }
  $("#appManageModal").modal('toggle');
  isNewjob = true;
  $("#appDeleteBtn").hide();
  $("#comTitle").text("");
  var btnId = btnID;
  switch (btnId) {
    case "toAppAdd":
      $("#appSubmiteDiv").hide();
      $("#onlineInterviewDiv").hide();
      $("#onsiteInterviewDiv").hide();
      $("#offerDiv").hide();
      $("#toApply_radio").prop('checked', true);
      break;
    case "appedAdd":
      $("#appSubmiteDiv").show();
      $("#onlineInterviewDiv").hide();
      $("#onsiteInterviewDiv").hide();
      $("#offerDiv").hide();
      $("#applied_radio").prop('checked', true);
      break;
    case "olIntAdd":
      $("#appSubmiteDiv").show();
      $("#onlineInterviewDiv").show();
      $("#onsiteInterviewDiv").hide();
      $("#offerDiv").hide();
      $("#online_radio").prop('checked', true);
      break;
    case "osIntAdd":
      $("#appSubmiteDiv").show();
      $("#onlineInterviewDiv").show();
      $("#onsiteInterviewDiv").show();
      $("#offerDiv").hide();
      $("#onsite_radio").prop('checked', true);
      break;
    case "rjctAdd":
      $("#appSubmiteDiv").show();
      $("#onlineInterviewDiv").show();
      $("#onsiteInterviewDiv").show();
      $("#offerDiv").hide();
      $("#rejected_radio").prop('checked', true);
      break;
    case "offerAdd":
      $("#appSubmiteDiv").show();
      $("#onlineInterviewDiv").show();
      $("#onsiteInterviewDiv").show();
      $("#offerDiv").show();
      $("#offered_radio").prop('checked', true);
      break;
    default:
      break;
  }
}

//refreshJob
function refreshJob() {
  $("#comToApply").empty();
  $("#comApplied").empty();
  $("#comOnline").empty();
  $("#comOnsite").empty();
  $("#comRejected").empty();
  $("#comOffered").empty();
  updateJobList();
}

//refresh document
function refreshDoc() {
  $("#cvList").empty();
  $("#coverList").empty();
  $("#otherList").empty();
  updateDocList();
}

//manageJob
function manageJob(companyRef, postionRef) {
  console.log(companyRef + "--------" + postionRef);
  var jobDataRef = firebase.database().ref('jobs/' + current_uid + '/' + companyRef + '/' + postionRef);

  jobDataRef.once('value').then(function(snapshot) {
    var company_name = snapshot.val().name;
    var company_postion = snapshot.val().position;
    var job_link = snapshot.val().link;
    var job_deadline = snapshot.val().deadline;
    var submitDate = snapshot.val().submit;
    var onlineDate = snapshot.val().online;
    var onsiteDate = snapshot.val().onsite;
    var offerDate = snapshot.val().offer;
    var status = snapshot.val().status;
    console.log(status);


    $("#companyName").val(company_name);
    $("#positionName").val(company_postion);
    $("#positionLink").val(job_link);
    $("#endDate").val(job_deadline);
    $("#appSubmitDate").val(submitDate);
    $("#onlineInterviewDate").val(onlineDate);
    $("#onsiteInterviewDate").val(onsiteDate);
    $("#offerDate").val(offerDate);

    switch (status) {
      case "ToApply":
        $("#toApply_radio").prop('checked', true);
        break;
      case "Applied":
        $("#applied_radio").prop('checked', true);
        break;
      case "OnlineInterview":
        $("#online_radio").prop('checked', true);
        break;
      case "Offered":
        $("#offered_radio").prop('checked', true);
        break;
      case "Rejected":
        $("#rejected_radio").prop('checked', true);
        break;
      case "OnsiteInterview":
        $("#onsite_radio").prop('checked', true);
        break;
      default:
        break;
    }
  });
  $("#comTitle").text(companyRef);
  $("#appManageModal").modal('toggle');
}

//delete job application
function deleteJob() {
  var conpanyName = $("#companyName").val().toUpperCase();
  var jobPosition = $("#positionName").val();
  firebase.database().ref('jobs/' + current_uid + '/' + conpanyName + '/' + jobPosition).remove(function(error) {
    if (error) {
      console.log(error);
    }
  });
  updateJobList();
  $("#appManageModal").modal('toggle');
}

//job manage madal submit
function submitJob() {
  if (isNewjob) {
    addJobToDatabase();
  } else {
    updateJobOnDatabase();
  }
}

//add new job
function addJobToDatabase() {
  var conpanyName = $("#companyName").val().toUpperCase();
  var jobPosition = $("#positionName").val();
  var jobLink = $("#positionLink").val();
  var jobDeadline = $("#endDate").val();
  var submitDate = $("#appSubmitDate").val();
  var onlineDate = $("#onlineInterviewDate").val();
  var onsiteDate = $("#onsiteInterviewDate").val();
  var offeredDate = $("#offerDate").val();
  var jobStatus = $('input[name=jobStatusRadio]:checked').val();

  firebase.database().ref('jobs/' + current_uid + '/' + conpanyName + '/' + jobPosition).set({
    name: conpanyName,
    position: jobPosition,
    link: jobLink,
    deadline: jobDeadline,
    submit: submitDate,
    online: onlineDate,
    onsite: onsiteDate,
    offer: offeredDate,
    status: jobStatus
  }, function(error) {
    if (error) {
      alert("Data could not be saved. " + error);
    } else {
      console.log("Data saved successfully.");
      updateUserProfile();
    }
  });
}

//update saved job
function updateJobOnDatabase() {
  var conpanyName = $("#companyName").val().toUpperCase();
  var jobPosition = $("#positionName").val();
  var jobLink = $("#positionLink").val();
  var jobDeadline = $("#endDate").val();
  var submitDate = $("#appSubmitDate").val();
  var onlineDate = $("#onlineInterviewDate").val();
  var onsiteDate = $("#onsiteInterviewDate").val();
  var offeredDate = $("#offerDate").val();
  var jobStatus = $('input[name=jobStatusRadio]:checked').val();

  console.log("======" + conpanyName);
  console.log("======" + jobPosition);
  console.log("======" + jobLink);
  console.log("======" + jobDeadline);
  console.log("======" + jobStatus);

  var updateData = {
    name: conpanyName,
    position: jobPosition,
    link: jobLink,
    deadline: jobDeadline,
    submit: submitDate,
    online: onlineDate,
    onsite: onsiteDate,
    offer: offeredDate,
    status: jobStatus
  }

  firebase.database().ref('jobs/' + current_uid + '/' + conpanyName + '/' + jobPosition).set(updateData).then(function() {
    console.log("Data upate successfully.");
    updateUserProfile();
  }).catch(function(error) {
    alert("Data could not be update." + error);
  });
}


//sign in with email and pwd
function pwdAuthenticate() {
  console.log("login clikced");
  var pwdEmail = $("#signINemail").val();
  var pwdPwd = $("#signINpwd").val();
  if (pwdEmail == "" || pwdPwd == "") {
    alert("Please input the email and password");
  } else {
    firebase.auth().signInWithEmailAndPassword(pwdEmail, pwdPwd).then(function(user) {
      //user loged in
      current_user = user;
      current_uid = user.uid;
      console.log(current_user);
      console.log(current_uid);
      $("#signInBtn").hide();
      $("#signOutBtn").show();
      $("#signInModal").modal('toggle');
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
    });
  }
}

// creat user account with email and pwd
function pwdRegister() {
  var rgUserName = $("#rgName").val();
  var rgEmail = $("#rgEmail").val();
  var rgPwd = $("#rgPwd").val();
  var pwdCheck = $("#pwdCheck").val();

  if (rgPwd != pwdCheck) {
    alert("The second password does not match the first one");
  } else {
    current_username = rgUserName;
    console.log(rgUserName);
    console.log(current_username);
    firebase.auth().createUserWithEmailAndPassword(rgEmail, rgPwd).then(function(user) {
      // user signed in
      current_user = user;
      current_uid = user.uid;
      console.log(current_uid);
      createUserInfo(current_uid, "notset");
      $("#signInBtn").hide();
      $("#signOutBtn").show();
      $("#signInModal").modal('toggle');
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
    });
  }

}

//creat user info on firebase
function createUserInfo(uid, photoURL) {

  var userID = uid;
  userInofRef = firebase.database().ref('users/' + userID);
  userInofRef.once('value').then(function(snapshot) {
    if (snapshot.exists()) {
      console.log("user exists");
    } else {
      console.log("******start to creat user: " + current_username);
      userInofRef.set({
        name: current_username,
        photoURL: photoURL,
        application: 0,
        offer: 0
      }, function(error) {
        if (error) {
          alert("user info could not be saved. " + error);
        } else {
          console.log("*****user info saved successfully.");
        }
      });
    }
  });
  //updateUserProfile();
}
//google authentication
function googleAthenticate() {
  firebase.auth().signInWithRedirect(googleProvider);
}

//facebook authentication
function facebookAthenticate() {
  firebase.auth().signInWithRedirect(facebookProvider);
}

//twitter authentication
function twitterAthenticate() {
  firebase.auth().signInWithRedirect(twitterProvider);
}

function updateJobList() {
  jobInfoRef.on("child_added", function(snapshot) {
    snapshot.forEach(function(child) {
      //console.log(child.key + ": " + child.val().name);
      var company_name = child.val().name;
      var company_postion = child.val().position;
      var job_status = child.val().status;

      var newLi = "<li class='list-group-item'>" + company_name + "<br>" + "<small class='font-italic'>" + "-" + company_postion + "</small>" + "</li>";

      switch (job_status) {
        case "ToApply":
          $("#comToApply").append(newLi);
          break;
        case "Applied":
          $("#comApplied").append(newLi);
          break;
        case "OnlineInterview":
          $("#comOnline").append(newLi);
          break;
        case "Offered":
          $("#comOffered").append(newLi);
          break;
        case "Rejected":
          $("#comRejected").append(newLi);
          break;
        case "OnsiteInterview":
          $("#comOnsite").append(newLi);
          break;
        default:
          break;
      }
    });
  });
}

//upate document list
function updateDocList() {
  firebase.database().ref('doc/' + current_uid).on("child_added", function(snapshot) {
    //console.log(snapshot.val());
    var doc_name = snapshot.val().name;
    var doc_type = snapshot.val().type;
    var doc_url = snapshot.val().downloadURL;
    var doc_target = snapshot.val().target;
    var doc_value = snapshot.val().id;
    //console.log(doc_name + "===" + doc_url);
    var newLi = "";
    if (doc_target == "notset") {
      newLi = "<li class='list-group-item'>" + "<a href=" + doc_url + " target = '_blank'>" + "<small class='font-italic'>" + doc_name + "</small>" + "</a>" +
        "<button type='button' class='close docDelete' value=" + doc_value + ">&times;</button>" + "</li>";
    } else {
      newLi = "<li class='list-group-item'>" + doc_target + "<br>" + "<a href=" + doc_url + " target = '_blank'>" + "<small class='font-italic'>" + doc_name + "</small>" + "</a>" +
        "<button type='button' class='close docDelete' value=" + doc_value + ">&times;</button>" + "</li>";
    }
    switch (doc_type) {
      case "CV":
        $("#cvList").append(newLi);
        break;
      case "Cover Letter":
        $("#coverList").append(newLi);
        break;
      case "Other":
        $("#otherList").append(newLi);
        break;
      default:
        break;
    }
  });
}

//setting an event listener for change of authentication state
firebase.auth().onAuthStateChanged(function(user) {
  current_user = user;
  if (user) {
    // User is signed in
    current_user = user;
    current_uid = user.uid;
    //current_username = user.displayName;
    jobInfoRef = firebase.database().ref('jobs/' + current_uid);
    $("#signInBtn").hide();
    $("#signOutBtn").show();
    //$("#greetingName").text(current_username);
    // console.log(current_user);
    // console.log(current_uid);
    //update list
    updateJobList();
    updateDocList();
    updateUserProfile();
    $("#pleaseSignIn").hide()
    $("#overview_info").show()
  } else {
    // No user is signed in
    current_username = null;
    current_uid = null;
    $("#greetingName").text("");
    $("#pleaseSignIn").show()
    $("#overview_info").hide()
  }
});

//update user profile
function updateUserProfile() {
  firebase.database().ref('users/' + current_uid).once('value').then(function(snapshot) {
    if (snapshot.exists()) {
      current_username = snapshot.val().name;
      var photoURL = snapshot.val().photoURL;
      // var applicationNum = snapshot.val().application;
      // var offerNum = snapshot.val().offer;
      var applied_Num = $('ul#comApplied').children('li').length;
      var online_Num = $('ul#comOnline').children('li').length;
      var onsite_Num = $('ul#comOnsite').children('li').length;
      var reject_Num = $('ul#comRejected').children('li').length;
      var offer_Num = $('ul#comOffered').children('li').length;
      var total_applied = applied_Num + online_Num + onsite_Num + reject_Num + offer_Num;

      $("#greetingName").text(current_username);
      $("#welcomeName").text(current_username);
      $("#positionNum").text(total_applied);
      $("#offerNum").text(offer_Num);

      firebase.database().ref('users/' + current_uid).update({
        application: total_applied,
        offer: offer_Num
      });

      if (photoURL != "notset") {
        $("#userImg").attr('src', photoURL);
      } else {
        $("#userImg").attr('src', 'img/user_img.png');
      }
    } else {
      updateUserProfile();
    }

  });
}

//clean data after user log out
function cleanList() {
  $("#comToApply").empty();
  $("#comApplied").empty();
  $("#comOnline").empty();
  $("#comOnsite").empty();
  $("#comRejected").empty();
  $("#comOffered").empty();
  $("#cvList").empty();
  $("#coverList").empty();
  $("#otherList").empty();
}

//user sign out
function signOut() {
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
    console.log("loged out");
    $("#signInBtn").show();
    $("#signOutBtn").hide();
    $("#greetingName").text("");
    current_user = null;
    current_uid = null;
    current_username = null;
    cleanList();
    $("#userImg").attr('src', 'img/user_img.png');
  }).catch(function(error) {
    // An error happened.
    console.log("sign out failed");
  });
}
