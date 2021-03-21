// var firebaseConfig = {
//   apiKey: "AIzaSyAumCp1xMLEBNgYl5lTbdPgCsis-ZmhhWA",
//   authDomain: "runner-d75d3.firebaseapp.com",
//   databaseURL: "https://runner-d75d3.firebaseio.com",
//   projectId: "runner-d75d3",
//   storageBucket: "runner-d75d3.appspot.com",
//   messagingSenderId: "256011544521",
//   appId: "1:256011544521:web:e1bd4d738474835ab5aa18",
//   measurementId: "G-QW5BFKD0XF"
// };

const firebaseConfig = {
  apiKey: "AIzaSyAzu7EuKdMhK9rmK-Wsoc37bFYd458AOkQ",
  authDomain: "runner-apps.firebaseapp.com",
  databaseURL: "https://runner-apps.firebaseio.com",
  projectId: "runner-apps",
  storageBucket: "runner-apps.appspot.com",
  messagingSenderId: "17149102706",
  appId: "1:17149102706:web:8f6809401a0961a16850eb",
  measurementId: "G-HKQFSCZZJ4"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

function CreateUser(username, fullname, email, pnumber, wallet, pword, repword, question, answer) {
  if (username !== "" && email !== "" && pnumber !== "" && pword !== "" && repword !== ""  && question !== ""  && answer !== "") {
    if(pword === repword && repword === pword){
      firebase.auth().createUserWithEmailAndPassword(email, pword).then(function(){
        firebase.auth().onAuthStateChanged(function(user) {
          if (!user.emailVerified) {
            user.sendEmailVerification();
            var firebaseUsers = firebase.database().ref("Users/"+username).push();
            firebaseUsers.set({
              username: username,
              fullname: fullname,
              email: email,
              phone: pnumber,
              wallet: wallet,
              question: question,
              answer: answer
            }).catch(function(error){
              var errorMessage = error.message;
              alert(errorMessage);
            });
            alert("Your have signup for Runner");
            document.getElementById("username_input_signup").value = "";
            document.getElementById("fullname_input").value = "";
            document.getElementById("email_input_signup").value = "";
            document.getElementById("pnumber_input_signup").value = "";
            document.getElementById("pword_input_signup").value = "";
            document.getElementById("repword_input_signup").value = "";      
            document.getElementById("question_input_signup").value = ""; 
            document.getElementById("signupMenu").style.display = "none";
            document.getElementById("loginMenu").style.display = "block";
            alert("Please check you email for verification"); 
          }
        });
      }).catch(function(error) {
        var errorMessage = error.message;
        alert(errorMessage);
      });
    }else if(pword !== repword && repword !== pword){
      alert("Your password is not match");
    }
  }else {
    alert("Please complete all the required details before you sign up");
  }
}

function LoginUser(email, pword) {
  if(email !== "" && pword !== ""){
    firebase.auth().signInWithEmailAndPassword(email, pword).then(function(){
      var curEmail = [];
      var curUsername = [];
      var getUsername;
      var getUserEmail;
      var UserRef = firebase.database().ref("Users");
      UserRef.once("value").then(function(parentSnapshot){
        parentSnapshot.forEach(function(childSnapshot) {
          var snap = childSnapshot.val();
          var key = Object.keys(snap);
          var UsersData = snap[key];
          curEmail.push(UsersData.email);
          curUsername.push(UsersData.username);
        });
        for(var i = 0; i < curEmail.length; i++){
          if(curEmail[i].localeCompare(email) == 0){
            getUsername = curUsername[i];
            getUserEmail = curEmail[i];
          }
        }
        var storageRef = firebase.storage().ref("Users/"+getUsername);
        storageRef.getDownloadURL().then(function(url){
          document.getElementById("profileImage").src = url;
          document.getElementById("profileRealImage").src = url;
          var userRef = firebase.database().ref("Users/"+getUsername);
          userRef.once("child_added").then(function(snapshot) {
            var user = snapshot.val();
            document.getElementById("profile_fullname").value = user.fullname;
            document.getElementById("profile_phone").value = user.phone;
            document.getElementById("profile_email").value = user.email;
            document.getElementById("wallet").innerHTML = user.wallet;
          });
          document.getElementById("username_input_login").value = "";
          document.getElementById("pword_input_login").value = "";
          document.getElementById("blank").style.display = "none";
          document.getElementById("loginMenu").style.display = "none";
          document.getElementById("signupMenu").style.display = "none";
          document.getElementById("signin-image").style.display = "none";
          document.getElementById("signout-image").style.display = "block";
          document.getElementById("wallet").style.display = "block";
          localStorage.setItem("username", getUsername);
          localStorage.setItem("email", getUserEmail);
          var localUser = localStorage.getItem("username");
          document.getElementById("title-username").innerHTML = localUser;
          RetrieveJob(localUser);
          location.reload();
        }).catch(function(error) {
          document.getElementById("profileImage").src = "img/user.png";
          document.getElementById("profileRealImage").src = "img/user.png";
          var checker = confirm("Dear " + getUsername + " we found that you dont have a profile picture, do you want to change that now?");
          if(checker){
            document.getElementById("blank").style.display = "block";
            document.getElementById("loginMenu").style.display = "none";
            document.getElementById("Profile_Update_Menu").style.display = "block";

            document.getElementById("username_input_login").value = "";
            document.getElementById("pword_input_login").value = "";
            document.getElementById("loginMenu").style.display = "none";
            document.getElementById("signupMenu").style.display = "none";
            document.getElementById("signin-image").style.display = "none";
            document.getElementById("signout-image").style.display = "block";
            document.getElementById("wallet").style.display = "block";
          }else {
            document.getElementById("blank").style.display = "none";
            document.getElementById("username_input_login").value = "";
            document.getElementById("pword_input_login").value = "";
            document.getElementById("loginMenu").style.display = "none";
            document.getElementById("signupMenu").style.display = "none";
            document.getElementById("signin-image").style.display = "none";
            document.getElementById("signout-image").style.display = "block";
            document.getElementById("wallet").style.display = "block";
          }
          retrieveLoginUser(getUsername);

          localStorage.setItem("username", getUsername);
          var localUser = localStorage.getItem("username");
          document.getElementById("title-username").innerHTML = localUser;
          RetrieveJob(localUser);
          $(".forShow").hide();
        });
      }).catch(function(error){
        var errorMessage = error.message;
        alert(errorMessage);
      });
    }).catch(function(error) {
      var errorMessage = error.message;
      alert(errorMessage);
    });
  }else if(username === "" || pword === ""){
    document.getElementById("username_input_login").value = "";
    document.getElementById("pword_input_login").value = "";
    alert("Please enter your username AND password");
  }else {
    alert("Please enter you username and password");
  }
}

function retrieveLoginUser (getUsername) {
  if(getUsername !== null || getUsername !== ""){
    var userRef = firebase.database().ref("Users/"+getUsername);
    userRef.once("child_added").then(function(snapshot) {
      var user = snapshot.val();
      document.getElementById("createJob_owner_phone").value = user.phone;
      document.getElementById("profile_fullname").value = user.fullname;
      document.getElementById("profile_questionType").value = user.question;
      document.getElementById("profile_answer_input").value = user.answer;
      document.getElementById("profile_phone").value = user.phone;
      document.getElementById("profile_email").value = user.email;
      document.getElementById("wallet").innerHTML = user.wallet;
    });
  }
}

function logout (){
  document.getElementById("signin-image").style.display = "block";
  document.getElementById("signout-image").style.display = "none";
  document.getElementById("wallet").style.display = "none";
  document.getElementById("profileImage").src = "img/user.png";
  firebase.auth().signOut().then(function(){
    localStorage.clear();
    location.reload();
  }).catch(function(error){
    alert(error);
  });
}

function jobUpdateStatus(id, state){
  var updateStatus = firebase.database().ref("Jobs");
  updateStatus.child(id).update({'status': state});
}

function jobUpdateRunner(id, runner){
  var updateStatus = firebase.database().ref("Jobs");
  updateStatus.child(id).update({'runner': runner});
}

firebase.database().ref("Jobs").on("child_changed", function(jobsnapshot){
  var snap = jobsnapshot.val();
  var owner = localStorage.getItem("username");
  var changeKey = jobsnapshot.key;
  firebase.database().ref("Jobs").on("child_added", function(snapshot){
    var key = snapshot.key;
    var jobsData = snapshot.val();
    if(jobsData.status === "Arrived" && jobsData.owner === owner){
      $("#popup_jobID").val(key);
      $(".popup").show();
    }else if(jobsData.status === "Finished" && jobsData.runner === owner){
      $(".mapTools").hide("slide", { direction: "down" }, 200);
      RetrieveJob(owner);
    }
  });
  $(".job_card_id").each(function(){
    if(changeKey === $(this).val()){
      $(this).closest(".job_child_content").children("div").children(".job_card_status").val(snap.status);
      $(this).closest(".job_child_content").closest(".job_content").closest(".job_card").children(".job_flash_details").children(".job_card_title_status").text(snap.status);
    }
  });
});

function ResetPassword (email){
  firebase.auth().sendPasswordResetEmail(email).then(function(){
    alert("Please check your email for a link to reset your password");
  }).catch(function(error){
    alert("Error: " + error);
  });
}

function ProfileUpdate (username, fullname, phone, email, question, answer, password, repassword) {
  if(email !== "" || email !== null){
    var UserRefKey = firebase.database().ref("Users");
    UserRefKey.child(username).orderByChild("email").equalTo(email).once("value").then(function(snapshot){
      if(snapshot.exists()){
        if(password === repassword && repassword === password && password !== "" && repassword !== ""){
          var passwordConfirm = confirm("Are you sure you want to update your password?");
          if(passwordConfirm === true){
            var curUser = firebase.auth().currentUser;
            if(curUser != null){
              curUser.updatePassword(password).then(function(){
                var userRefDelete = firebase.database().ref("Users/"+username);
                userRefDelete.once("value").then(function(snapshot){
                  userRefDelete.remove();
                  var snap = snapshot.val();
                  var key = Object.keys(snap);
                  var userData = snap[key];
                  var updateData = {
                    username: username,
                    fullname: fullname,
                    email: email,
                    phone: phone,
                    wallet: userData.wallet,
                    question: question,
                    answer: answer
                  };
                  var newUpdateKey = firebase.database().ref().child('Users/'+username).push().key;
                  var updates = {};
                  updates['/Users/' + username + "/" + newUpdateKey] = updateData;
                  firebase.database().ref().update(updates);
                  alert("Successful update your profile");
                });
              }).catch(function(error){
                alert("Fail: "+error);
              });
            }else if(curUser == null){
              alert("There is no user");
            }
          }
        }else if (password === "" && repassword === ""){
          var userRefDelete = firebase.database().ref("Users/"+username);
          userRefDelete.once("value").then(function(snapshot){
            userRefDelete.remove();
            var snap = snapshot.val();
            var key = Object.keys(snap);
            var userData = snap[key];
            var updateData = {
              username: username,
              fullname: fullname,
              email: email,
              phone: phone,
              wallet: userData.wallet,
              question: question,
              answer: answer
            };
            var newUpdateKey = firebase.database().ref().child('Users/'+username).push().key;
            var updates = {};
            updates['/Users/' + username + "/" + newUpdateKey] = updateData;
            firebase.database().ref().update(updates);
            alert("Successful update your profile");
          });
        }else if(password !== repassword || repassword !== password){
          alert("Your password is not match");
        }
      }else if(!snapshot.exists()){
        var confirmation = confirm("Are you sure you want to change your email address from " + snapshot.val().email + " to " + email + "?");
        if(confirmation){
          var user = firebase.auth().currentUser;
          user.updateEmail(email).then(function(){
            firebase.auth().onAuthStateChanged(function(user){
              if(user){
                var userRefDelete = firebase.database().ref("Users/"+username);
                userRefDelete.once("value").then(function(snapshot){
                  userRefDelete.remove();
                  var snap = snapshot.val();
                  var key = Object.keys(snap);
                  var userData = snap[key];
                  var updateData = {
                    username: username,
                    fullname: fullname,
                    email: email,
                    phone: phone,
                    wallet: userData.wallet,
                    question: question,
                    answer: answer
                  };
                  var newUpdateKey = firebase.database().ref().child('Users/'+username).push().key;
                  var updates = {};
                  updates['/Users/' + username + "/" + newUpdateKey] = updateData;
                  firebase.database().ref().update(updates);
                });
              }
            });
            alert("Successfuly change your email to " + email);
          }).catch(function(error){
            var errorMessage = error.message;
            alert(errorMessage);
          });
        }
      }
    });
  }
  try {
    var photo = document.getElementById("profile_image");
    if(photo.files.length !== 0){
      var storageRef = firebase.storage().ref("Users/"+username);
      storageRef.put(photo.files[0]).then(function(){
        alert("successfully change your profile picture");
      }).catch(function(error){
        alert(error);
      });
    }
  }catch(error){
    var errorMessage = error.message;
    alert(errorMessage);
  }
  userProfileCall(username);
}

function readURL (){
  document.getElementById("profileRealImage").src = "";
  var ofReader = new FileReader();
  ofReader.readAsDataURL(document.getElementById("profile_image").files[0]);
  ofReader.onload = function(e){
    document.getElementById("profileRealImage").src = e.target.result;
  };
}

firebase.database().ref("Users").on("child_added", function(snapshot){
  var currUsername = localStorage.getItem("username");
  var snap = snapshot.val();
  var key = Object.keys(snap);
  var userData = snap[key];
  if(userData.username === currUsername){
    $("#profile_fullname").val(userData.fullname);
    $("#profile_phone").val(userData.phone);
    $("#profile_email").val(userData.email);
    $("#profile_questionType").val(userData.question);
    $("#profile_answer_input").val(userData.answer);
    var storageRef = firebase.storage().ref("Users");
    storageRef.child(currUsername).getDownloadURL().then(function(url){
      document.getElementById("profileImage").src = url;
      document.getElementById("profileRealImage").src = url;
    });
  }
});

function CreateJob (owner,phone,title, desc, loc, price, start, end, type, status, lat, long) {
  if(owner !== "", title !== "" && desc !== "" && loc !== "" && price !== "" && start !== "" && end !== "" && type !== "" && lat !== "" && long !== ""){    
    if(price.toString().indexOf(".") == -1){
      price = price + ".00";
    }
    var confrimBox = confirm("Title: "+title+"\nDescription: "+desc+"\nLocation: "+loc+"\nPrice: "+price+"\nDuration End: "+start+"\nDuration End: "+end+"\nType: "+type);
    if(confrimBox == true){
      var firebaseJobs = firebase.database().ref("Jobs").push();
      firebaseJobs.set({
        owner: owner,
        phone: phone,
        title: title,
        desc: desc,
        loc: loc,
        price: price,
        start: start,
        end: end,
        type: type,
        status: status,
        lat: lat,
        long: long,
        runner: ""
      });
      document.getElementById("createjob-title").value = "";
      document.getElementById("create_job_title").value = "";
      document.getElementById("create_job_desc").value = "";
      document.getElementById("create_job_address").value = "";
      document.getElementById("create_job_price").value = "";
      document.getElementById("create_job_expired_start").value = "";
      document.getElementById("create_job_expired_end").value = "";
      // document.getElementById("jobtype").value = "None";
      RetrieveJob(owner);
    }
  }
}

function RetrieveJob (curUser){
  $('#body').empty();
  firebase.database().ref("Jobs").on("child_added", function(snapshot){
    var key = snapshot.key;
    var jobsData = snapshot.val();
    if(jobsData.status === "Arrived" && jobsData.owner === msgSender){
      $("#popup_jobID").val(key);
      $(".popup").show();
    }
    if(jobsData.status !== "Finished"){
      var appendedChild = "";
      if(curUser != null && curUser.localeCompare(jobsData.owner) != 0){
        appendedChild = "<div class='job_card'>" + 
                          "<h3 class='job_card_title'>"+jobsData.title + "<hr></h3>" +
                          "<div class='job_flash_details'>" +
                          "<p>Service Type : <h4 class='job_card_title_type'>"+jobsData.type+"</h4></p>" +
                          "<p>Wage : <h4 class='job_card_title_price'>RM "+jobsData.price+"</h4></p>" +
                          "<p>Status : <h4 class='job_card_title_status'>"+jobsData.status+"</h4></p>" +
                          "<p>Location : <h4 class='job_card_title_loc'>"+jobsData.loc+"</h4></p>" +
                          "</div>" +
                          "<div class='runnerDetails'>" + 
                          "<input type='hidden' id='runDetUsername' value='"+jobsData.runner+"'>" +
                          "</div>" +
                          "<div class='job_content'>" +
                          "<div class='job_child_content'>" +
                          "<input type='hidden' class='job_card_id' value='"+key+"'>" +
                          "<input type='hidden' class='job_card_owner' value='"+jobsData.owner+"'>" +
                          "<input type='hidden' class='job_card_lat' value='"+jobsData.lat+"'>" +
                          "<input type='hidden' class='job_card_long' value='"+jobsData.long+"'>" +
                          "<div><p>Type : </p> <input type='text' class='job_card_type' value='"+jobsData.type+"' readonly></div>" +
                          "<div><p>Location : </p> <textarea class='job_card_address' readonly>"+jobsData.loc+"</textarea></div>" +
                          "<br><br><br><br><div><p>Wage : </p> <input type='text' class='job_card_price' value='RM "+jobsData.price+"' readonly></div>" +
                          "<div><p>Start : </p> <input type='text' class='job_card_start' value='"+jobsData.start+"' readonly></div>" +
                          "<div><p>End : </p> <input type='text' class='job_card_end' value='"+jobsData.end+"' readonly></div>" +
                          "<div><p>Status : </p> <input type='text' class='job_card_status' value='"+jobsData.status+"' readonly></div>" +
                          "<div><p>Phone No. : </p> <input type='tel' pattern='[0-9]{3}-[0-9]{7}' class='job_card_phone' value='"+jobsData.phone+"' readonly></div>" +
                          "<div id='job_card_desc_main'><br><p>Remarks:</p><textarea class='job_card_desc' readonly>"+jobsData.desc+"</textarea></div>" +
                          "<ul>" +
                          "<li id='job_card_li_take'><button class='job_card_take' id='job_card_take'><img src='img/checked.png' width='30' height='30'></button></li>" +
                          "</ul>" +
                          "</div>" +
                          "</div>" +
                          "</div>";
        $("#body").append(appendedChild);
      }else if(curUser != null && curUser.localeCompare(jobsData.owner) == 0){
        appendedChild = "<div class='job_card'>" +
                          "<h3 class='job_card_title'>"+jobsData.title+"<hr></h3>" +
                          "<div class='job_flash_details'>" +
                          "<p>Service Type : <h4 class='job_card_title_type'>"+jobsData.type+"</h4></p>" +
                          "<p>Wage : <h4 class='job_card_title_price'>RM "+jobsData.price+"</h4></p>" +
                          "<p>Status : <h4 class='job_card_title_status'>"+jobsData.status+"</h4></p>" +
                          "<p>Location : <h4 class='job_card_title_loc'>"+jobsData.loc+"</h4></p>" +
                          "</div>" +
                          "<div class='runnerDetails'>" + 
                          "<input type='hidden' id='runDetUsername' value='"+jobsData.runner+"'>" +
                          "</div>" +
                          "<div class='job_content'>" +
                          "<div class='job_child_content'>" +
                          "<input type='hidden' class='job_card_id' value='"+key+"'>" +
                          "<input type='hidden' class='job_card_owner' value='"+jobsData.owner+"'>" +
                          "<input type='hidden' class='job_card_lat' value='"+jobsData.lat+"'>" +
                          "<input type='hidden' class='job_card_long' value='"+jobsData.long+"'>" +
                          "<div><p>Type : </p> <input type='text' class='job_card_type' value='"+jobsData.type+"' readonly></div>" +
                          "<div><p>Location : </p> <textarea class='job_card_address' readonly>"+jobsData.loc+"</textarea></div>" +
                          "<br><br><br><br><div><p>Wage : </p> <input type='text' class='job_card_price' value='RM "+jobsData.price+"' readonly></div>" +
                          "<div><p>Start : </p> <input type='text' class='job_card_start' value='"+jobsData.start+"' readonly></div>" +
                          "<div><p>End : </p> <input type='text' class='job_card_end' value='"+jobsData.end+"' readonly></div>" +
                          "<div><p>Status : </p> <input type='text' class='job_card_status' value='"+jobsData.status+"' readonly></div>" +
                          "<div><p>Phone No. : </p> <input type='tel' pattern='[0-9]{3}-[0-9]{7}' class='job_card_phone' value='"+jobsData.phone+"' readonly></div>" +
                          "<div id='job_card_desc_main'><br><p>Remarks:</p><textarea class='job_card_desc' readonly>"+jobsData.desc+"</textarea></div>" +
                          "<ul>" +
                          "<li id='job_card_li_delete'><button class='job_card_delete' id='job_card_delete'><img src='img/quit.png' width='30' height='30'></button></li>" +
                          "<li id='job_card_li_update'><button class='job_card_update' id='job_card_update'><img src='img/system.png' width='30' height='30'></button></li>" +
                          "</ul>" +
                          "</div>" +
                          "</div>" +
                          "</div>";
        $("#body").append(appendedChild);
      }else if(curUser == null || curUser.localeCompare(jobsData.owner) == null){
        appendedChild = "<div class='job_card'>" +
                          "<h3 class='job_card_title'>"+jobsData.title + "<hr></h3>" +
                          "<div class='job_flash_details'>" +
                          "<p>Service Type : <h4 class='job_card_title_type'>"+jobsData.type+"</h4></p>" +
                          "<p>Wage : <h4 class='job_card_title_price'>RM "+jobsData.price+"</h4></p>" +
                          "<p>Status : <h4 class='job_card_title_status'>"+jobsData.status+"</h4></p>" +
                          "<p>Location : <h4 class='job_card_title_loc'>"+jobsData.loc+"</h4></p>" +
                          "</div>" +
                          "<div class='runnerDetails'>" + 
                          "<input type='hidden' id='runDetUsername' value='"+jobsData.runner+"'>" +
                          "</div>" +
                          "<div class='job_content'>" +
                          "<div class='job_child_content'>" +
                          "<input type='hidden' class='job_card_id' value='"+key+"'>" +
                          "<input type='hidden' class='job_card_owner' value='"+jobsData.owner+"'>" +
                          "<input type='hidden' class='job_card_lat' value='"+jobsData.lat+"'>" +
                          "<input type='hidden' class='job_card_long' value='"+jobsData.long+"'>" +
                          "<div><p>Type : </p> <input type='text' class='job_card_type' value='"+jobsData.type+"' readonly></div>" +
                          "<div><p>Location : </p> <textarea class='job_card_address' readonly>"+jobsData.loc+"</textarea></div>" +
                          "<br><br><br><br><div><p>Wage : </p> <input type='text' class='job_card_price' value='RM "+jobsData.price+"' readonly></div>" +
                          "<div><p>Start : </p> <input type='text' class='job_card_start' value='"+jobsData.start+"' readonly></div>" +
                          "<div><p>End : </p> <input type='text' class='job_card_end' value='"+jobsData.end+"' readonly></div>" +
                          "<div><p>Status : </p> <input type='text' class='job_card_status' value='"+jobsData.status+"' readonly></div>" +
                          "<div><p>Phone No. : </p> <input type='tel' pattern='[0-9]{3}-[0-9]{7}' class='job_card_phone' value='"+jobsData.phone+"' readonly></div>" +
                          "<div id='job_card_desc_main'><br><p>Remarks:</p><textarea class='job_card_desc' readonly>"+jobsData.desc+"</textarea></div>" +
                          "<ul>" +
                          "</ul>" +
                          "</div>" +
                          "</div>" +
                          "</div>";
        $("#body").append(appendedChild);
      }
    }
  });
}

var msgSession = $("#msg_session").val();
var msgSender = localStorage.getItem("username");
var appendedChild = "";
if(msgSender !== null){
  firebase.database().ref("Message").on("child_added", function(snapshot){
    var snap = snapshot.val();
    if(msgSession === snap.session){
      if(msgSender === snap.sender){
        appendedChild = "<tr id='msgSender'>" +
                        "<td><h5>"+snap.sender+" </h5><p>"+snap.message+"</p></td>" +
                        "</tr>";
        $("#messagePopulate tbody").append(appendedChild);
      }else if(msgSender === snap.receiver){
        appendedChild = "<tr id='msgReceiver'>" +
                        "<td><h5>"+snap.receiver+" </h5><p>"+snap.message+"</p></td>" +
                        "</tr>";
        $("#messagePopulate tbody").append(appendedChild);
      }
    }
  });
  $("#messagePopulate").animate({ scrollTop: $(document).height() }, "slow");
}else if(msgSender !== null){
  firebase.database().ref("Message").on("child_added", function(snapshot){
    var snap = snapshot.val();
    if(msgSender === snap.receiver){
      appendedChild = "<tr id='notifyMsg'>" +
                      "<td>" +
                      "<h4>"+snap.sender+" </h4>" +
                      "<input type='hidden' id='notify_receiver' value='"+snap.receiver+"'>" +
                      "<input type='hidden' id='notify_sender' value='"+snap.sender+"'>" +
                      "<input type='hidden' id='notify_session' value='"+snap.session+"'>" +
                      "<p>"+snap.message+"</p>" +
                      "</td>" +
                      "</tr>";
      $(".notifyClose table tbody").prepend(appendedChild);
    }
  });

  firebase.database().ref("Jobs").on("child_added", function(snapshot){
    var key = snapshot.key;
    var jobsData = snapshot.val();
    if(jobsData.status === "Arrived" && jobsData.owner === msgSender){
      $(".popup").show();
    }
    if(jobsData.status !== "Finished"){
      var appendedChild = "";
      if(curUser != null && curUser.localeCompare(jobsData.owner) != 0){
        appendedChild = "<div class='job_card'>" + 
                          "<h3 class='job_card_title'>"+jobsData.title + "<hr></h3>" +
                          "<div class='job_flash_details'>" +
                          "<p>Service Type : <h4 class='job_card_title_type'>"+jobsData.type+"</h4></p>" +
                          "<p>Wage : <h4 class='job_card_title_price'>RM "+jobsData.price+"</h4></p>" +
                          "<p>Status : <h4 class='job_card_title_status'>"+jobsData.status+"</h4></p>" +
                          "<p>Location : <h4 class='job_card_title_loc'>"+jobsData.loc+"</h4></p>" +
                          "</div>" +
                          "<div class='runnerDetails'>" + 
                          "<input type='hidden' id='runDetUsername' value='"+jobsData.runner+"'>" +
                          "</div>" +
                          "<div class='job_content'>" +
                          "<div class='job_child_content'>" +
                          "<input type='hidden' class='job_card_id' value='"+key+"'>" +
                          "<input type='hidden' class='job_card_owner' value='"+jobsData.owner+"'>" +
                          "<input type='hidden' class='job_card_lat' value='"+jobsData.lat+"'>" +
                          "<input type='hidden' class='job_card_long' value='"+jobsData.long+"'>" +
                          "<div><p>Type : </p> <input type='text' class='job_card_type' value='"+jobsData.type+"' readonly></div>" +
                          "<div><p>Location : </p> <textarea class='job_card_address' readonly>"+jobsData.loc+"</textarea></div>" +
                          "<br><br><br><br><div><p>Wage : </p> <input type='text' class='job_card_price' value='RM "+jobsData.price+"' readonly></div>" +
                          "<div><p>Start : </p> <input type='text' class='job_card_start' value='"+jobsData.start+"' readonly></div>" +
                          "<div><p>End : </p> <input type='text' class='job_card_end' value='"+jobsData.end+"' readonly></div>" +
                          "<div><p>Status : </p> <input type='text' class='job_card_status' value='"+jobsData.status+"' readonly></div>" +
                          "<div><p>Phone No. : </p> <input type='tel' pattern='[0-9]{3}-[0-9]{7}' class='job_card_phone' value='"+jobsData.phone+"' readonly></div>" +
                          "<div id='job_card_desc_main'><br><p>Remarks:</p><textarea class='job_card_desc' readonly>"+jobsData.desc+"</textarea></div>" +
                          "<ul>" +
                          "<li id='job_card_li_take'><button class='job_card_take' id='job_card_take'><img src='img/checked.png' width='30' height='30'></button></li>" +
                          "</ul>" +
                          "</div>" +
                          "</div>" +
                          "</div>";
        $("#body").append(appendedChild);
      }else if(curUser != null && curUser.localeCompare(jobsData.owner) == 0){
        appendedChild = "<div class='job_card'>" +
                          "<h3 class='job_card_title'>"+jobsData.title+"<hr></h3>" +
                          "<div class='job_flash_details'>" +
                          "<p>Service Type : <h4 class='job_card_title_type'>"+jobsData.type+"</h4></p>" +
                          "<p>Wage : <h4 class='job_card_title_price'>RM "+jobsData.price+"</h4></p>" +
                          "<p>Status : <h4 class='job_card_title_status'>"+jobsData.status+"</h4></p>" +
                          "<p>Location : <h4 class='job_card_title_loc'>"+jobsData.loc+"</h4></p>" +
                          "</div>" +
                          "<div class='runnerDetails'>" + 
                          "<input type='hidden' id='runDetUsername' value='"+jobsData.runner+"'>" +
                          "</div>" +
                          "<div class='job_content'>" +
                          "<div class='job_child_content'>" +
                          "<input type='hidden' class='job_card_id' value='"+key+"'>" +
                          "<input type='hidden' class='job_card_owner' value='"+jobsData.owner+"'>" +
                          "<input type='hidden' class='job_card_lat' value='"+jobsData.lat+"'>" +
                          "<input type='hidden' class='job_card_long' value='"+jobsData.long+"'>" +
                          "<div><p>Type : </p> <input type='text' class='job_card_type' value='"+jobsData.type+"' readonly></div>" +
                          "<div><p>Location : </p> <textarea class='job_card_address' readonly>"+jobsData.loc+"</textarea></div>" +
                          "<br><br><br><br><div><p>Wage : </p> <input type='text' class='job_card_price' value='RM "+jobsData.price+"' readonly></div>" +
                          "<div><p>Start : </p> <input type='text' class='job_card_start' value='"+jobsData.start+"' readonly></div>" +
                          "<div><p>End : </p> <input type='text' class='job_card_end' value='"+jobsData.end+"' readonly></div>" +
                          "<div><p>Status : </p> <input type='text' class='job_card_status' value='"+jobsData.status+"' readonly></div>" +
                          "<div><p>Phone No. : </p> <input type='tel' pattern='[0-9]{3}-[0-9]{7}' class='job_card_phone' value='"+jobsData.phone+"' readonly></div>" +
                          "<div id='job_card_desc_main'><br><p>Remarks:</p><textarea class='job_card_desc' readonly>"+jobsData.desc+"</textarea></div>" +
                          "<ul>" +
                          "<li id='job_card_li_delete'><button class='job_card_delete' id='job_card_delete'><img src='img/quit.png' width='30' height='30'></button></li>" +
                          "<li id='job_card_li_update'><button class='job_card_update' id='job_card_update'><img src='img/system.png' width='30' height='30'></button></li>" +
                          "</ul>" +
                          "</div>" +
                          "</div>" +
                          "</div>";
        $("#body").append(appendedChild);
      }else if(curUser == null || curUser.localeCompare(jobsData.owner) == null){
        appendedChild = "<div class='job_card'>" +
                          "<h3 class='job_card_title'>"+jobsData.title + "<hr></h3>" +
                          "<div class='job_flash_details'>" +
                          "<p>Service Type : <h4 class='job_card_title_type'>"+jobsData.type+"</h4></p>" +
                          "<p>Wage : <h4 class='job_card_title_price'>RM "+jobsData.price+"</h4></p>" +
                          "<p>Status : <h4 class='job_card_title_status'>"+jobsData.status+"</h4></p>" +
                          "<p>Location : <h4 class='job_card_title_loc'>"+jobsData.loc+"</h4></p>" +
                          "</div>" +
                          "<div class='runnerDetails'>" + 
                          "<input type='hidden' id='runDetUsername' value='"+jobsData.runner+"'>" +
                          "</div>" +
                          "<div class='job_content'>" +
                          "<div class='job_child_content'>" +
                          "<input type='hidden' class='job_card_id' value='"+key+"'>" +
                          "<input type='hidden' class='job_card_owner' value='"+jobsData.owner+"'>" +
                          "<input type='hidden' class='job_card_lat' value='"+jobsData.lat+"'>" +
                          "<input type='hidden' class='job_card_long' value='"+jobsData.long+"'>" +
                          "<div><p>Type : </p> <input type='text' class='job_card_type' value='"+jobsData.type+"' readonly></div>" +
                          "<div><p>Location : </p> <textarea class='job_card_address' readonly>"+jobsData.loc+"</textarea></div>" +
                          "<br><br><br><br><div><p>Wage : </p> <input type='text' class='job_card_price' value='RM "+jobsData.price+"' readonly></div>" +
                          "<div><p>Start : </p> <input type='text' class='job_card_start' value='"+jobsData.start+"' readonly></div>" +
                          "<div><p>End : </p> <input type='text' class='job_card_end' value='"+jobsData.end+"' readonly></div>" +
                          "<div><p>Status : </p> <input type='text' class='job_card_status' value='"+jobsData.status+"' readonly></div>" +
                          "<div><p>Phone No. : </p> <input type='tel' pattern='[0-9]{3}-[0-9]{7}' class='job_card_phone' value='"+jobsData.phone+"' readonly></div>" +
                          "<div id='job_card_desc_main'><br><p>Remarks:</p><textarea class='job_card_desc' readonly>"+jobsData.desc+"</textarea></div>" +
                          "<ul>" +
                          "</ul>" +
                          "</div>" +
                          "</div>" +
                          "</div>";
        $("#body").append(appendedChild);
      }
    }
  });
}

function listenReceiver (sender) {
  firebase.database().ref("Message").on("child_added", function(snapshot){
    var snap = snapshot.val();
    if(sender === snap.receiver){
      var appendedChild = "<tr id='notifyMsg'>" +
                          "<td>" +
                          "<h4>"+snap.sender+" </h4>" +
                          "<input type='hidden' id='notify_receiver' value='"+snap.receiver+"'>" +
                          "<input type='hidden' id='notify_sender' value='"+snap.sender+"'>" +
                          "<input type='hidden' id='notify_session' value='"+snap.session+"'>" +
                          "<p>"+snap.message+"</p>" +
                          "</td>" +
                          "</tr>";
      $(".notify table tbody").prepend(appendedChild);
    }
  });
}

function RetrieveMessage (sender, receiver, session){
  $('#messagePopulate tbody').empty();
  var appendedChild = "";
  firebase.database().ref("Message").on("child_added", function(snapshot){
    var snap = snapshot.val();
    if(session === snap.session){
      if(sender === snap.sender){
        appendedChild = "<tr id='msgSender'>" +
                        "<td><h5>"+snap.sender+" </h5><p>"+snap.message+"</p></td>" +
                        "</tr>";
        $("#messagePopulate tbody").append(appendedChild);
      }else if(sender === snap.receiver){
        appendedChild = "<tr id='msgReceiver'>" +
                        "<td><h5>"+snap.sender+" </h5><p>"+snap.message+"</p></td>" +
                        "</tr>";
        $("#messagePopulate tbody").append(appendedChild);
      }
    }
  });
  $("#messagePopulate").animate({ scrollTop: $(document).height() }, "slow");
}

function DeleteMessage (sender, receiver, session){
  $('#messagePopulate tbody').empty();
  $('.notify table tbody').empty();
  var MessageRefKey = firebase.database().ref("Message");
  MessageRefKey.once("value").then(function(snapshot){
    snapshot.forEach(function(childSnapshot) {
      var snap = childSnapshot.val();
      if(session === snap.session){
        if((sender === snap.sender && receiver === snap.receiver) || (sender === snap.receiver && receiver === snap.sender)){
          var ParentKey = childSnapshot.key;
          var deleteMsg = firebase.database().ref("Message/"+ParentKey);
          deleteMsg.remove();
        }
      }
    });
  });
  localStorage.removeItem("curLat");
  localStorage.removeItem("curLng");
  localStorage.removeItem("jobLat");
  localStorage.removeItem("jobLng");
}

function CreateMesage (sender, receiver, message, jobID) {
  var messageUser = firebase.database().ref("Message");
  messageUser.child(sender).once("value").then(function(snapshot){
    if(!snapshot.exists()){
      var createMessage = firebase.database().ref("Message").push();
      createMessage.set({
        sender: sender,
        receiver: receiver,
        message: message,
        session: jobID,
        status: ""
      }).catch(function(error){
        var errorMessage = error.message;
        alert(errorMessage);
      });
    }else if(snapshot.exists()){
      messageUser.child(sender).child(receiver).once("value").then(function(snapshot){
        var createMessage;
        if(!snapshot.exists()){
          createMessage = firebase.database().ref("Message").push();
          createMessage.set({
            sender: sender,
            receiver: receiver,
            message: message,
            session: jobID,
            status: ""
          }).catch(function(error){
            var errorMessage = error.message;
            alert(errorMessage);
          });
        }else if(snapshot.exists()){
          createMessage = firebase.database().ref("Message").push();
          createMessage.set({
            sender: sender,
            receiver: receiver,
            message: message,
            session: jobID,
            status: ""
          }).catch(function(error){
            var errorMessage = error.message;
            alert(errorMessage);
          });
        }
      });
    }
    $("#messagePopulate").animate({ scrollTop: $(document).height() }, "slow");
    new Audio("sounds/put-down.mp3").play();  
  }).catch(function (error){
    var errorMessage = error.message;
    alert(errorMessage);
  });
}


function listenerToMessage () {
  var messageUser = firebase.database().ref("Message");
  messageUser.once("value").then(function(snapshot){
    snapshot.forEach(function(childSnapshot){
      var chatRoom = childSnapshot.key;
      firebase.database().ref("Message").child(chatRoom).on("child_added", function(messagesnapshot){
        console.log(messagesnapshot.val());
      });
    });
  }).catch(function(error){
    console.log(error);
  });
}

function autoDeleteJob (id) {
  
}

function UpdateSendData (id,owner,title, desc, loc, price, start, end, type,status) {
  var removeRM = price.replace("RM","");
  document.getElementById("update_job_id").value = id;
  document.getElementById("update_job_title").value = title;
  document.getElementById("update_job_desc").value = desc;
  document.getElementById("update_job_address").value = loc;
  document.getElementById("update_job_price").value = parseFloat(removeRM);
  document.getElementById("update_job_expired_start").value = start;
  document.getElementById("update_job_expired_end").value = end;
  document.getElementById("updatejobtype").value = type;
  document.getElementById("update_job_owner").value = owner;
  document.getElementById("update_job_status").value = status;
}

function DeleteJob (owner,id){
  var confirmBox = confirm("Are you sure you want to delete this job?");
  if(confirmBox == true){
    var jobRef = firebase.database().ref("Jobs");
    jobRef.child(id).once("value", function(snapshot){
      if(snapshot.exists){
        var jobDelete = firebase.database().ref("Jobs/"+id);
        jobDelete.remove();
      }
    });
    RetrieveJob(owner);
  }
}

function UpdateJob (id,owner,phone, title, desc, loc, price, start, end, type, status) {
  var jobRef = firebase.database().ref("Jobs/"+id);
  jobRef.once("value").then(function(snapshot){
    if(snapshot.exists()){
      updateData = {
        owner: owner,
        phone: phone,
        title: title,
        desc: desc,
        loc: loc,
        price: price,
        start: start,
        end: end,
        type: type,
        status: status
      };
      var updates = {};
      updates['/Jobs/' + id] = updateData;
      firebase.database().ref().update(updates);
      RetrieveJob(owner);
    }else if(!snapshot.exists()){
      console.log("Data not exist");
    }
  }).catch(function(error){
    console.log("JobRef: "+error);
  });
  RetrieveJob(owner);
  alert("Update Successful");
}

function userProfileCall (username) {
  var userRef = firebase.database().ref("Users/"+username);
  userRef.once("value").then(function(snapshot){
    if(snapshot.exists()){
      var storageRef = firebase.storage().ref("Users");
      storageRef.child(username).getDownloadURL().then(function(url){
        document.getElementById("profileImage").src = url;
        document.getElementById("profileRealImage").src = url;
      }).catch(function(error) {
        document.getElementById("profileImage").src = "img/user.png";
        document.getElementById("profileRealImage").src = "img/user.png";
        // console.log("Failed to load your image");
      });
      userRef.once("child_added").then(function(snapshot) {
        var user = snapshot.val();
        document.getElementById("profile_fullname").value = user.fullname;
        document.getElementById("profile_phone").value = user.phone;
        document.getElementById("profile_email").value = user.email;
      });
    }
  });
}

function sessionChecker (curUser) {
  if(curUser !== null){
    document.getElementById("title-username").innerHTML = curUser;
    userProfileCall(curUser);
    document.getElementById("signin-image").style.display = "none";
    document.getElementById("signout-image").style.display = "block";
    document.getElementById("wallet").style.display = "block";
  }else if(curUser === null){
    document.getElementById("title-username").innerHTML = "User";
    document.getElementById("username_input_login").value = "";
    document.getElementById("pword_input_login").value = "";
    document.getElementById("blank").style.display = "none";
    document.getElementById("loginMenu").style.display = "none";
    document.getElementById("signupMenu").style.display = "none";
    document.getElementById("signin-image").style.display = "block";
    document.getElementById("signout-image").style.display = "none";
    document.getElementById("wallet").style.display = "none";
  }
}

function DatePicker () {
  $("#create_job_expired_start").datepicker({
    dateFormat: "dd-M-yy",
    minDate: 0,
    onSelect: function () {
        var dt2 = $('#create_job_expired_end');
        var startDate = $(this).datepicker('getDate');
        //add 30 days to selected date
        startDate.setDate(startDate.getDate() + 30);
        var minDate = $(this).datepicker('getDate');
        var dt2Date = dt2.datepicker('getDate');
        //difference in days. 86400 seconds in day, 1000 ms in second
        var dateDiff = (dt2Date - minDate) / (86400 * 1000);

        //dt2 not set or dt1 date is greater than dt2 date
        if (dt2Date == null || dateDiff < 0) {
            dt2.datepicker('setDate', minDate);
        }
        //dt1 date is 30 days under dt2 date
        else if (dateDiff > 30) {
            dt2.datepicker('setDate', startDate);
        }
        //sets dt2 maxDate to the last day of 30 days window
        // dt2.datepicker('option', 'maxDate', startDate);
        
        //first day which can be selected in dt2 is selected date in dt1
        dt2.datepicker('option', 'minDate', minDate);
    }
  });
  $('#create_job_expired_end').datepicker({
      dateFormat: "dd-M-yy",
      minDate: 0
  });

  $("#update_job_expired_start").datepicker({
    dateFormat: "dd-M-yy",
    minDate: 0,
    onSelect: function () {
        var dt2 = $('#update_job_expired_end');
        var startDate = $(this).datepicker('getDate');
        //add 30 days to selected date
        startDate.setDate(startDate.getDate() + 30);
        var minDate = $(this).datepicker('getDate');
        var dt2Date = dt2.datepicker('getDate');
        //difference in days. 86400 seconds in day, 1000 ms in second
        var dateDiff = (dt2Date - minDate) / (86400 * 1000);

        //dt2 not set or dt1 date is greater than dt2 date
        if (dt2Date == null || dateDiff < 0) {
            dt2.datepicker('setDate', minDate);
        }
        //dt1 date is 30 days under dt2 date
        else if (dateDiff > 30) {
            dt2.datepicker('setDate', startDate);
        }
        //sets dt2 maxDate to the last day of 30 days window
        // dt2.datepicker('option', 'maxDate', startDate);

        //first day which can be selected in dt2 is selected date in dt1
        dt2.datepicker('option', 'minDate', minDate);
    }
  });
  $('#update_job_expired_end').datepicker({
      dateFormat: "dd-M-yy",
      minDate: 0
  });
}

//Maps
function GetLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
      function geoSuccess(position) {
          var latitude = position.coords.latitude;
          var longitude = position.coords.longitude;
          localStorage.setItem("latitude", latitude);
          localStorage.setItem("longtitude", longitude);
          
          geocoder = new google.maps.Geocoder();
          var latlng = new google.maps.LatLng(latitude, longitude);
          geocoder.geocode({'latLng': latlng}, 
          function(results, status) {
              if(status === google.maps.GeocoderStatus.OK) {
                  if(results[1]) {
                      //formatted address
                      var address = results[0].formatted_address;
                      localStorage.setItem("Location",address);
                  } else {
                      console.log("No results found");
                  }
              } else {
                  console.log("Geocoder failed due to: " + status);
              }
          });
      },
      function(error){
           console.log(error.message);
      }, {
           enableHighAccuracy: true,
           timeout : 10000, 
           maximumAge: 1000, 
           accuracy:10
      });
  }
}

function TraceWaypoint(userLat, userLng) {
    var directionsService = new google.maps.DirectionsService();
    var directionsRenderer = new google.maps.DirectionsRenderer();
    var desLatLng = {lat: parseFloat(userLat), lng: parseFloat(userLng)};
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 20,
      center: desLatLng,
      gestureHandling: 'greedy',
      mapTypeControl: true,
      mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: google.maps.ControlPosition.TOP_CENTER
      },
      zoomControl: true,
      zoomControlOptions: {
          position: google.maps.ControlPosition.LEFT_CENTER
      },
      scaleControl: true,
      streetViewControl: true,
      streetViewControlOptions: {
          position: google.maps.ControlPosition.LEFT_TOP
      },
      fullscreenControl: true
    });
    var marker = new google.maps.Marker({
      position: desLatLng,
      map: map,
      title: 'You!'
    });
    directionsRenderer.setMap(map);
    marker.setMap(map);
    navigator.geolocation.watchPosition( 
      function (position){
        document.getElementById('map_lat').innerHTML = position.coords.latitude;
        document.getElementById('map_lng').innerHTML = position.coords.longitude;
        localStorage.setItem("curLat",position.coords.latitude);
        localStorage.setItem("curLng",position.coords.longitude);
        var curlatlng = {lat: position.coords.latitude, lng: position.coords.longitude};
        marker.setPosition(curlatlng);
      },function(error){
        window.alert("watchPosition: "+error.message);
      }, {
        enableHighAccuracy: true,
        timeout : 10000, 
        maximumAge: 500, 
        accuracy: 10
      }
    );
    if(localStorage.getItem("curLat") !== null && localStorage.getItem("curLng") !== null){
      var markerLatLng = {lat: parseFloat(localStorage.getItem("curLat")), lng: parseFloat(localStorage.getItem("curLng"))};
      localStorage.removeItem("curLat");
      localStorage.removeItem("curLng");
      directionsService.route({
        origin: markerLatLng,
        destination: desLatLng,
        optimizeWaypoints: true,
        provideRouteAlternatives: true,
        travelMode: 'DRIVING'
      }, function(result, status) {
        if (status === google.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(result);
        }else if(status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT){
          setTimeout(1000);
        } else {
          window.alert('Status: ' + status + "\n" + 'Response: ' + result);
        }
      });
    }
    $(".mapTools").show("slide", { direction: "down" }, 200);
}

function RefreshWayPoint(userLat, userLng) {
  var directionsService = new google.maps.DirectionsService();
  var directionsRenderer = new google.maps.DirectionsRenderer();
  var desLatLng = {lat: parseFloat(userLat), lng: parseFloat(userLng)};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 20,
    center: desLatLng,
    gestureHandling: 'greedy',
    mapTypeControl: true,
    mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.TOP_CENTER
    },
    zoomControl: true,
    zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_CENTER
    },
    scaleControl: true,
    streetViewControl: true,
    streetViewControlOptions: {
        position: google.maps.ControlPosition.LEFT_TOP
    },
    fullscreenControl: true
  });
  var marker = new google.maps.Marker({
    position: desLatLng,
    map: map,
    title: 'You!'
  });
  directionsRenderer.setMap(map);
  marker.setMap(map);
  navigator.geolocation.watchPosition( 
    function (position){
      document.getElementById('map_lat').innerHTML = position.coords.latitude;
      document.getElementById('map_lng').innerHTML = position.coords.longitude;
      localStorage.setItem("curLat",position.coords.latitude);
      localStorage.setItem("curLng",position.coords.longitude);
      var curlatlng = {lat: position.coords.latitude, lng: position.coords.longitude};
      marker.setPosition(curlatlng);
    },function(error){
      window.alert("watchPosition: "+error.message);
    }, {
      enableHighAccuracy: true,
      timeout : 10000, 
      maximumAge: 500, 
      accuracy: 10
    }
  );
  if(localStorage.getItem("curLat") !== null && localStorage.getItem("curLng") !== null){
    var markerLatLng = {lat: parseFloat(localStorage.getItem("curLat")), lng: parseFloat(localStorage.getItem("curLng"))};
    localStorage.removeItem("curLat");
    localStorage.removeItem("curLng");
    directionsService.route({
      origin: markerLatLng,
      destination: desLatLng,
      optimizeWaypoints: true,
      provideRouteAlternatives: true,
      travelMode: 'DRIVING'
    }, function(result, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsRenderer.setDirections(result);
      }else if(status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT){
        setTimeout(1000);
      } else {
        window.alert('Status: ' + status + "\n" + 'Response: ' + result);
      }
    });
  }
}