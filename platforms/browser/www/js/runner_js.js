jQuery(document).ready(function($) {
  GetLocation();

  $(".settingMenu").hide();
  $(".notify").hide();
  $(".signupMenu").hide();
  $(".blank").hide();
  $(".loginMenu").hide();
  $("#signout-image").hide();
  $(".Logout_Menu").hide();
  $(".Profile_Update_Menu").hide();
  $(".create_job_menu").hide();
  $(".update_job_menu").hide();
  $("#wallet").hide();
  $(".job_child_content").hide();
  $(".mapTools").hide();
  $(".Messanger").hide();
  $("#popup_d").hide();
  $("#item_delivered").hide();
  $(".popup").hide();
  $(".runnercoin").hide();
  $(".searchBar").hide();
  $(".clearSearch").hide();
  $(".aboutMe").hide();

  // alert("Width: " + $(window).width() + "\nHeight: " + $(window).height());

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

  // $("#create_job_expired_start").click(function(){
  //   //Prev
  //   $("a[title='Prev']").css("background-color","white");
  //   $("a[title='Prev']").css("float","left");

  //   //Next
  //   $("a[title='Next']").css("background-color","white");
  //   $("a[title='Next']").css("float","right");
  // });

  // $("#create_job_expired_end").click(function(){
  //   //Prev
  //   $("a[title='Prev']").css("background-color","white");
  //   $("a[title='Prev']").css("float","left");

  //   //Next
  //   $("a[title='Next']").css("background-color","white");
  //   $("a[title='Next']").css("float","right");
  // });

  // $(".ui-datepicker-calendar").on("click","a[title='Prev']", function(){
  //   $(this).css("background-color","white");
  //   $(this).css("float","left");
  // });

  // $(".ui-datepicker-calendar").on("click","a[title='Next']", function(){
  //   $(this).css("background-color","white");
  //   $(this).css("float","right");
  // });

  setInterval(function () {
    var objToday = new Date(),
        dayOfMonth = today + ( objToday.getDate() < 10) ? '0' + objToday.getDate() : objToday.getDate(),
        months = new Array('Jan', 'Feb', 'March', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'),
        curMonth = months[objToday.getMonth()],
        curYear = objToday.getFullYear(),
        curHour = objToday.getHours() > 12 ? objToday.getHours() - 12 : (objToday.getHours() < 10 ? "0" + objToday.getHours() : objToday.getHours()),
        curMinute = objToday.getMinutes() < 10 ? "0" + objToday.getMinutes() : objToday.getMinutes(),
        curSeconds = objToday.getSeconds() < 10 ? "0" + objToday.getSeconds() : objToday.getSeconds(),
        curMeridiem = objToday.getHours() > 12 ? "PM" : "AM";
    var today = dayOfMonth +"-"+curMonth+"-"+curYear+"  -  "+curHour+":"+curMinute+":"+curSeconds+" "+curMeridiem;
    $("#map_currTime").text(today);
  }, 1000);

  var curUser = localStorage.getItem("username");
  sessionChecker(curUser);
  if(curUser !== null){
    $(".forShow").hide();
    listenReceiver(curUser);
    RetrieveJob(curUser);
    retrieveLoginUser(curUser);
  }else if(curUser === null){
    $(".forShow").show();
  }

  $("body").on("change", "input[type=text]", function(){
    $(this).val($(this).val().replace(/[^a-zA-Z0-9--]*$/gi, ''));
  });

  $("body").on("change", "input[type=tel]", function(){
    if($(this).val().includes("-")){
      $(this).val($(this).val().replace(/[^0-9--]*$/gi, ''));
    }else if(!$(this).val().includes("-")){
      alert("Format: 012-3456789");
    }
  });

  $("#fullname_input").change(function(){
    $(this).val($(this).val().replace(/[^a-zA-Z--]*$/gi, ''));
  });

  $("#about_us").click(function(){
    $(".blank").show();
    $(".settingMenu").hide("slide", { direction: "left" }, 200);
    $(".aboutMe").show("slide", { direction: "left" }, 200);
  });

  $(".aboutMe").click(function(){
    $(".blank").hide();
    $(".aboutMe").hide("slide", { direction: "left" }, 200);
  });

  $( function() {
    var availableTags = [
      "Transportation",
      "Delivery",
      "Food",
      "Cleaning",
      "Others",
      "Idle",
      "Ongoing"
    ];
    $("#searchInput").autocomplete({
      source: availableTags
    });
  });

  $("#searchButton").click(function(){
    var searchBar = $("#searchInput").val();
    var titleStatus = $(".job_card_title_status");
    if(searchBar !== ""){
      $(".job_card_title_type").each(function(i){
        if(searchBar !== $(this).text() && searchBar !== $(titleStatus[i]).text()){
          $(this).closest(".job_flash_details").closest(".job_card").hide("slide", { direction: "right" }, 200);
        }
      });
      $(".clearSearch").show("slide", { direction: "down" }, 200);
      $("#searchInput").val("");
    }else if(searchBar === ""){
      alert("Please type something, then we search for you");
    }
  });

  $(".clearSearch").click(function(){
    $(this).hide("slide", { direction: "down" }, 200);
    $(".job_card_title_type").each(function(){
      $(this).closest(".job_flash_details").closest(".job_card").show("slide", { direction: "right" }, 200);
    });
  });

  $("#searchMyJob").click(function(){
    $(".job_card_owner").each(function(){
      if($(this).val() !== curUser){
        $(this).closest(".job_child_content").closest(".job_content").closest(".job_card").hide("slide", { direction: "right" }, 200);
      }
    });
    $(".clearSearch").show("slide", { direction: "down" }, 200);
  });

  $("#joblist").click(function(){
    if(curUser !== null){
      $(".blank").show();
      $(".settingMenu").hide("slide", { direction: "left" }, 200);
      $(".searchBar").show("slide", { direction: "up" }, 200);
    }else if(curUser === null){
      $(".blank").show();
      $(".loginMenu").show("fast");
    }
  });

  $("#moveToJob").click(function(){
    if(curUser !== null){
      $('html,body').animate({
        scrollTop: $(".body").offset().top
      }, 'smooth');
    }else if(curUser === null){
      $(".blank").show();
      $(".loginMenu").show("fast");
    }
  });

  setInterval( function(){
    if($("#UnyieldingSpirit").attr("class") === "red"){
      $(".outtereye").animate({
        right: "-10px"
      }, {
        duration: 250
      });
      $(".innereye").animate({
        right: "15px"
      }, {
        duration: 250
      });
      $(".eyereflection").animate({
        right: "5px"
      });
      $(".eyebrow").animate({
        top: "355px"
      });
      $(".whiteeye").animate({
        height: "70px"
      }, {
        duration: 500
      });
      $(".eyeshadow").animate({
        height: "80px"
      }, {
        duration: 500
      });
      $("#UnyieldingSpirit").attr("class", "blue");
    }else if($("#UnyieldingSpirit").attr("class") === "blue"){
      $(".outtereye").animate({
        right: "-1px"
      }, {
        duration: 250
      });
      $(".innereye").animate({
        right: "25px"
      }, {
        duration: 250
      });
      $(".eyereflection").animate({
        right: "10px"
      });
      $(".eyebrow").animate({
        top: "350px"
      });
      $(".whiteeye").animate({
        height: "69px"
      }, {
        duration: 500
      });
      $(".eyeshadow").animate({
        height: "79px"
      }, {
        duration: 500
      })
      $("#UnyieldingSpirit").attr("class", "red");
    }
  }, 2000);

  $("#UnyieldingSpirit").click(function(){
    if($(this).attr("class") === "red"){
      $(".war_scar_1, .war_scar_2").animate({
        backgroundColor: "rgba(0, 168, 255,1.0)"
      }, {
        duration: 1000
      });
      $(".outtereye").animate({
        backgroundColor: "rgba(72, 126, 176,1.0)"
      }, {
        duration: 1000
      });
      $(".eyeshadow").animate({
        backgroundColor: "rgba(0,0,0,0.9)"
      }, {
        duration: 1000
      });
      $(".eyebrow").animate({
        backgroundColor: "black"
      }, {
        duration: 1000
      });
    }else if($(this).attr("class") === "blue"){
      $(".war_scar_1, .war_scar_2").animate({
        backgroundColor: "rgba(232, 65, 24,1.0)"
      }, {
        duration: 1000
      });
      $(".outtereye").animate({
        backgroundColor: "rgba(56, 24, 16, 0.99)"
      }, {
        duration: 1000
      });
      $(".eyeshadow").animate({
        backgroundColor: "#2f3640"
      }, {
        duration: 1000
      });
      $(".eyebrow").animate({
        backgroundColor: "#27100c"
      }, {
        duration: 1000
      });
    }
  });

  $("#coinTopUp").click(function(){
    window.open($('#bankType option').filter(':selected').val(), '_blank');
  });

  $("#topup").click(function(){
    if(curUser !== null){
      $(".blank").show();
      $(".settingMenu").hide("slide", { direction: "left" }, 200);
      $(".runnercoin").show("slide", { direction: "left" }, 200);
    }else if(curUser === null){
      $(".settingMenu").hide("slide", { direction: "left" }, 200);
      $(".loginMenu").show("fast");
    }
  });

  $("#cancelConfirmButton").click(function(){
    $(".blank").hide();
    $(".runnercoin").hide("slide", { direction: "left" }, 200);
  });

  $(".menuClose").click(function() {
    $(".blank").hide();
    $(".settingMenu").hide("slide", { direction: "left" }, 200);
  });

  $(".notifyClose").click(function(){
    $(".blank").hide();
    $(".notify").hide("slide", { direction: "right" }, 200);
  });

  $(".settingLogo").click(function() {
    $(".blank").show();
    $(".settingMenu").show("slide", { direction: "left" }, 300);
  });

  $("#toMessenger").click(function() {
    if(curUser !== null){
      $(".blank").show();
      $(".notify").show("slide", { direction: "right" }, 300);
    }else if(curUser === null){
      $(".blank").show();
      $(".loginMenu").show("fast");
    }
  });

  $(".body").click(function() {
    $(".settingMenu").hide("slide", { direction: "left" }, 200);
  });

  $("#LogInButton").click(function() {
    $(".loginMenu").show("fast");
    $(".signupMenu").hide("fast");
  });

  $("#SignUpButton").click(function() {
    $(".signupMenu").show("fast");
    $(".loginMenu").hide("fast");
  });

  $(".blank").click(function() {
    $(".blank").hide();
    $(".loginMenu").hide("slide", { direction: "right" }, 200);
    $(".signupMenu").hide("slide", { direction: "right" }, 200);
    $(".Logout_Menu").hide("slide", { direction: "right" }, 200);
    $(".Profile_Update_Menu").hide("slide", { direction: "left" }, 200);
    $(".settingMenu").hide("slide", { direction: "left" }, 200);
    $(".notify").hide("slide", { direction: "right" }, 200);
    $(".runnercoin").hide("slide", { direction: "left" }, 200);
    $(".searchBar").hide("slide", { direction: "up" }, 200);
    $(".aboutMe").hide();

    $("#username_input_signup").val("");
    $("#fullname_input").val("");
    $("#email_input_signup").val("");
    $("#pnumber_input_signup").val("");
    $("#pword_input_signup").val("");
    $("#repword_input_signup").val("");

    $("#username_input_login").val("");
    $("#username_input_login").val("");
    $("#pword_input_login").val("");

    $(".create_job_menu").hide("slide", { direction: "left" }, 200);
    $(".update_job_menu").hide("slide", { direction: "left" }, 200);
    $(".Messanger").hide("slide", { direction: "down" }, 200);
  });

  $(".signupClose").click(function() {
    $(".blank").hide();
    $(".signupMenu").hide("fast");
    $("#username_input_signup").val("");
    $("#email_input_signup").val("");
    $("#pnumber_input_signup").val("");
    $("#pword_input_signup").val("");
    $("#repword_input_signup").val("");
  });

  $("#signin-image").click(function() {
    $(".blank").show();
    $(".loginMenu").show("fast");
    $(".settingMenu").hide("slide", { direction: "left" }, 200);
  });

  $("#signout-image").click(function() {
    $(".blank").show();
    $(".Logout_Menu").show("fast");
    $(".settingMenu").hide("slide", { direction: "left" }, 200);
  });

  $("#submitSignUp").click(function() {
    var username = $("#username_input_signup").val();
    var fullname = $("#fullname_input").val();
    var email = $("#email_input_signup").val();
    var pnumber = $("#pnumber_input_signup").val();
    var pword = $("#pword_input_signup").val();
    var repword = $("#repword_input_signup").val();
    var question = $("#questionType").val();
    var answer = $("#question_input_signup").val();
    var wallet = "0.00";
    if(!pnumber.includes("-")){
      alert("Your phone number is wrong format. \nExample: 012-3456789");
    }else if(pnumber.includes("-")){
      CreateUser(username, fullname, email, pnumber, wallet, pword, repword, question, answer);
    }
    // $(".signupMenu").hide("fast");
    // $(".loginMenu").show("fast");
  });

  $("#LoginSubmit").click(function(){
    var email = $("#username_input_login").val();
    var password = $("#pword_input_login").val();
    LoginUser(email, password);
  });

  $("#LogoutSubmit").click(function(){
    $(".blank").hide();
    $(".Logout_Menu").hide("fast");
    $("#title-username").text("User");
    logout();
  });

  $("#LogoutCancel").click(function(){
    $(".blank").hide();
    $(".Logout_Menu").hide("fast");
  });

  $(".mapClose").click(function(){
    var confrimBox = confirm("Are you sure you want to give up this job?"+
                             "\nYou will get penalty for doing this, if you have give up job 3 times you cant take job for 2 weeks");
    if(confrimBox == true){
      var sender = $("#msg_sender").val();
      var receiver = $("#msg_receiver").val();
      var session = $("#msg_session").val();
      var jobId = $("#mapTools_jobId").val();
      DeleteMessage(sender,receiver,session);
      jobUpdateStatus(jobId, "Idle");
      RetrieveJob(curUser);
      $(".blank").hide();
      $(".mapTools").hide("slide", { direction: "down" }, 200);
    }
  });

  $(".popup").on("change","#popup_delivered",function(){
    var checkLength = parseInt($(this).val());
    if(checkLength === 100){
      $(this).hide("slide", { direction: "right" }, 200);
      $("#item_arrived").hide("slide", { direction: "right" }, 200);
      $("#item_delivered").show("slide", { direction: "left" }, 200);
      $("#popup_info").hide("slide", { direction: "right" }, 200);
      $("#popup_d").fadeIn("slow");
      $(".popup").delay(1000).fadeOut(700);
      if($(this).css('opacity') === 0) {
        $(".popup").hide();
      }
      var jobID = $("#popup_jobID").val();
      jobUpdateStatus(jobID, "Finished");
      RetrieveJob(curUser);
      $(this).val(0);
    }else {
      $(this).val(0);
    }
  });

  $(".mapArrive").click(function(){
    var id = $("#mapTools_jobId").val();
    jobUpdateStatus(id, "Arrived");
    $(".blank").hide();
  });

  $(".profileImage").click(function(){
    // var username =  $(".title-username").text();
    // var currUsername = localStorage.getItem("username");
    // if(currUsername === username){
    //   $(".blank").show();
    //   $(".settingMenu").hide("slide", { direction: "left" }, 200);
    //   $(".Profile_Update_Menu").show("fast");
    // }else if(currUsername === "" || currUsername !== username || currUsername === null) {
    //   $(".blank").show();
    //   $(".settingMenu").hide("slide", { direction: "left" }, 200);
    //   $(".loginMenu").show("fast");
    // }
  });

  $("#profile_image").change(function(){
    readURL();
  });

  $("#profile").click(function(){
    var username =  $(".title-username").text();
    var currUsername = localStorage.getItem("username");
    if(currUsername === username){
      $(".blank").show();
      $(".settingMenu").hide("slide", { direction: "left" }, 200);
      $(".Profile_Update_Menu").show("slide", { direction: "left" }, 200);
    }else if(currUsername === "" || currUsername !== username || currUsername === null) {
      $(".blank").show();
      $(".settingMenu").hide("slide", { direction: "left" }, 200);
      $(".loginMenu").show();
    }
  });

  $("#createjob").click(function(){
    var username =  $(".title-username").text();
    var currUsername = localStorage.getItem("username");
    if(currUsername === username){
      $(".blank").show();
      $(".loginMenu").hide("fast");
      $(".signupMenu").hide("fast");
      $(".Logout_Menu").hide("fast");
      $(".Profile_Update_Menu").hide("slide", { direction: "left" }, 200);
      $(".settingMenu").hide("slide", { direction: "left" }, 200);
      $(".create_job_menu").show("slide", { direction: "left" }, 200);
    }else if(currUsername === "" || currUsername !== username || currUsername === null){
      $(".blank").show();
      $(".settingMenu").hide("slide", { direction: "left" }, 200);
      $(".loginMenu").show("fast");
    }
  });

  $("#ButtonProfileCancel").click(function(){
    $(".blank").hide();
    $(".Profile_Update_Menu").hide("slide", { direction: "left" }, 200);
  });

  $("#SubmitProfileUpdate").click(function(){
    var ChangePassword = $("#profile_ChangePassword").val();
    var ChangeRePassword = $("#profile_ChangeRePassword").val();
    var username = localStorage.getItem("username");
    var fullname = $("#profile_fullname").val();
    var phonenumber = $("#profile_phone").val();
    var email = $("#profile_email").val();
    var question = $("#profile_questionType").val();
    var asnwer = $("#profile_answer_input").val();
    ProfileUpdate(username, fullname, phonenumber, email, question, asnwer, ChangePassword, ChangeRePassword);
  });

  $("#login_forgot_password").click(function(){
    var email = $("#username_input_login").val();
    if(email !== "" || email !== null){
      ResetPassword(email);
    }
  });

  $("#submitcreatejob").click(function(){
    var lat = localStorage.getItem("latitude");
    var long = localStorage.getItem("longtitude");
    var owner = localStorage.getItem("username");
    var title = $("#create_job_title").val();
    var desc = $("#create_job_desc").val();
    var loc = $("#create_job_address").val();
    var price = $("#create_job_price").val();
    var start = $("#create_job_expired_start").val() + " - " + $("#create_job_start_clock").val() + ":" + $("#create_job_start_clock_min").val() + " " + $("#create_job_start_daynight").val();
    var end = $("#create_job_expired_end").val() + " - " + $("#create_job_end_clock").val() + ":" + $("#create_job_end_clock_min").val() + " " + $("#create_job_end_daynight").val();
    var type = $("#jobtype").val();
    var status = "Idle";
    var phone = $("#createJob_owner_phone").val();
    // console.log(owner);
    // console.log(title);
    // console.log(desc);
    // console.log(loc);
    // console.log(price);
    // console.log(start);
    // console.log(end);
    // console.log(type);
    // console.log(lat);
    // console.log(long);
    CreateJob(owner,phone, title, desc, loc, price, start, end, type, status, lat, long);
    $(".blank").hide();
    $(".create_job_menu").hide("slide", { direction: "left" }, 200);
  });

  $("#cancel_createjob").click(function(){
    $(".blank").hide();
    $(".create_job_menu").hide("slide", { direction: "left" }, 200);
  });

  $("#cancel_updatejob").click(function(){
    $(".blank").hide();
    $(".update_job_menu").hide("slide", { direction: "left" }, 200);
  });

  $("#submitupdatejob").click(function(){
    var id = $("#update_job_id").val();
    var owner = $("#update_job_owner").val();
    var title = $("#update_job_title").val();
    var desc = $("#update_job_desc").val();
    var loc = $("#update_job_address").val();
    var price = $("#update_job_price").val();
    var start = $("#update_job_expired_start").val();
    var end = $("#update_job_expired_end").val();
    var type = $("#updatejobtype").val();
    var status = $("#update_job_status").val();
    var phone = $("#createJob_owner_phone").val();
    // console.log(id);
    // console.log(owner);
    // console.log(title);
    // console.log(type);
    // console.log(loc);
    // console.log(price);
    // console.log(desc);
    // console.log(start);
    // console.log(end);
    // console.log(status);
    $(".update_job_menu").hide("slide", { direction: "left" }, 200);
    $(".blank").hide();
    UpdateJob(id, owner,phone, title, desc, loc, price, start, end, type,status);
  });

  $(".body").on("click","#job_card_delete",function(){
    var id = $(this).closest('ul').closest('.job_card').children(".job_content").children(".job_child_content").children('.job_card_id').val();
    // var id = $(this).closest('ul').closest('.job_card').children('.job_card_id').val();
    var owner = localStorage.getItem("username");
    DeleteJob(owner,id);
  });

  $(".body").on("click","#job_card_update",function(){
    var status = $(this).closest('ul').closest('.job_card').children(".job_content").children(".job_child_content").children('div').children('.job_card_status').val();
    if(status === "Idle"){
      var id = $(this).closest('ul').closest('.job_card').children(".job_content").children(".job_child_content").children('.job_card_id').val();
      var title = $(this).closest('ul').closest('.job_card').children('.job_card_title').text();
      var owner = $(this).closest('ul').closest('.job_card').children(".job_content").children(".job_child_content").children('.job_card_owner').val(); 
      var type = $(this).closest('ul').closest('.job_card').children(".job_content").children(".job_child_content").children('div').children('.job_card_type').val();
      var loc = $(this).closest('ul').closest('.job_card').children(".job_content").children(".job_child_content").children('div').children('.job_card_address').val();
      var price = $(this).closest('ul').closest('.job_card').children(".job_content").children(".job_child_content").children('div').children('.job_card_price').val();
      var start = $(this).closest('ul').closest('.job_card').children(".job_content").children(".job_child_content").children('div').children('.job_card_start').val();
      var end = $(this).closest('ul').closest('.job_card').children(".job_content").children(".job_child_content").children('div').children('.job_card_end').val();
      var desc = $(this).closest('ul').closest('.job_card').children(".job_content").children(".job_child_content").children('div').children('.job_card_desc').val();
      // console.log(id);
      // console.log(owner);
      // console.log(title);
      // console.log(type);
      // console.log(loc);
      // console.log(price);
      // console.log(desc);
      // console.log(start);
      // console.log(end);
      // console.log(status);
      UpdateSendData(id, owner,title,desc, loc, price, start, end, type,status);
      $(".update_job_menu").show("slide", { direction: "left" }, 200);
      $(".blank").show();
    }else if(status !== "Idle"){
      var checker = confirm("You can't update job that is already been taken, do you want to message your runner?");
      if(checker === true){
        var receiver = $(this).closest("#job_card_li_update").closest("ul").closest(".job_child_content").closest(".job_content").closest(".job_card").children(".runnerDetails").children("#runDetUsername").val();
        var sender = $(this).closest("#job_card_li_update").closest("ul").closest(".job_child_content").children(".job_card_owner").val();
        var session = $(this).closest("#job_card_li_update").closest("ul").closest(".job_child_content").children(".job_card_id").val();
        $("#toMessage").text(receiver);
        $("#msg_receiver").val(receiver);
        $("#msg_sender").val(sender);
        $("#msg_session").val(session);
        $(".blank").show();
        $(".Messanger").show("slide", { direction: "down" }, 200);
        RetrieveMessage(receiver,sender,session);
      }
    }
  });

  $("#job_card_chat").click(function(){
    var getSender = localStorage.getItem("username");
    var getReceiver = $('#msg_receiver').val();
    var getSession = $("#msg_session").val();
    $("#reciever").val(getReceiver);
    $("#sender").val(getSender);
    $("#toMessage").text(getReceiver);
    $(".blank").show();
    $(".Messanger").show("slide", { direction: "down" }, 200);
    RetrieveMessage(getSender,getReceiver,getSession);
  });

  $("#closeMessage").click(function(){
    $(".blank").hide();
    $(".Messanger").hide("slide", { direction: "down" }, 200);
  });

  $("#sendMessage").click(function(){
    var message = $("#YourMessageHere").val();
    var sender = $("#msg_sender").val();
    var receiver = $("#msg_receiver").val();
    var jobID = $("#msg_session").val();
    if(message !== ""){
      CreateMesage(sender, receiver, message,jobID);
      $("#YourMessageHere").val("");
      // RetrieveMessage(sender,receiver);
    }
  });

  $(".notify").on("click","#notifyMsg",function(){
    var sender = $(this).children("td").children("#notify_sender").val();
    var receiver = $(this).children("td").children("#notify_receiver").val();
    var session = $(this).children("td").children("#notify_session").val();
    $("#toMessage").text(sender);
    $("#msg_receiver").val(sender);
    $("#msg_sender").val(receiver);
    $("#msg_session").val(session);
    $(".notify").hide("slide", { direction: "right" }, 200);
    $(".blank").show();
    $(".Messanger").show("slide", { direction: "down" }, 200);
    RetrieveMessage(receiver,sender,session);
  });

  $(".body").on("click", "#job_card_take", function(){
    $(".blank").show();
    var sender = localStorage.getItem("username");
    var id = $(this).closest('ul').closest('.job_card').children(".job_content").children(".job_child_content").children('.job_card_id').val();
    var owner = $(this).closest('ul').closest('.job_card').children(".job_content").children(".job_child_content").children('.job_card_owner').val();
    var title = $(this).closest('ul').closest('.job_card').children(".job_card_title").text();
    var type = $(this).closest('ul').closest('.job_card').children(".job_content").children(".job_child_content").children("div").children('.job_card_type').val();
    var loc = $(this).closest('ul').closest('.job_card').children(".job_content").children(".job_child_content").children("div").children('.job_card_address').val();
    var price = $(this).closest('ul').closest('.job_card').children(".job_content").children(".job_child_content").children("div").children('.job_card_price').val();
    var start = $(this).closest('ul').closest('.job_card').children(".job_content").children(".job_child_content").children("div").children('.job_card_start').val();
    var end = $(this).closest('ul').closest('.job_card').children(".job_content").children(".job_child_content").children("div").children('.job_card_end').val();
    var desc = $(this).closest('ul').closest('.job_child_content').children("#job_card_desc_main").children('.job_card_desc').text();
    var lat = $(this).closest('ul').closest('.job_card').children(".job_content").children(".job_child_content").children('.job_card_lat').val();
    var lng = $(this).closest('ul').closest('.job_card').children(".job_content").children(".job_child_content").children('.job_card_long').val();
    var job_RunnerDetails = $(this).closest("#job_card_li_take").closest("ul").closest(".job_child_content").closest(".job_content").closest(".job_card").children(".runnerDetails").children(".runDetUsername");
    localStorage.setItem("jobLat", lat);
    localStorage.setItem("jobLng", lng);
    // console.log(owner);
    // console.log(title);
    // console.log(type);
    // console.log(loc);
    // console.log(price);
    // console.log(start);
    // console.log(end);
    // console.log(desc);
    // console.log(lat);
    // console.log(lng);
    var confrimBox = confirm("Owner: "+owner+"\nTitle: "+title+"\nType: "+type+
                             "\nDescription: "+desc+"\nLocation: "+loc+"\nPrice: "+
                             price+"\nDuration End: "+start+"\nDuration End: "+end);
    if(confrimBox == true){
      jobUpdateStatus(id, "Ongoing");
      jobUpdateRunner(id, sender);
      TraceWaypoint(lat, lng);
      job_RunnerDetails.val(sender);
      $("#mapTools_owner").val(owner);
      $("#mapTools_jobId").val(id);
      $("#map_loc").text(loc);
      $("#map_remarks").text(desc);
      $("#map_start").text(start);
      $("#map_end").text(end);
      $("#msg_receiver").val(owner);
      $("#msg_sender").val(sender);
      $("#msg_session").val(id);
    }
  });

  $(".body").on("click",".job_card",function(){
    var getContentTitle = $(this).children(".job_card_title");
    var getContentChild = $(this).children(".job_content").children(".job_child_content");
    var getContentFlash = $(this).children(".job_flash_details");
    // var getContent
    $(".job_child_content").hide("fast");
    $(".job_card_title_type").show();
    $(".job_card_title_price").show();
    $(".job_card_title_loc").show();
    $(".job_card_title").css("font-size", "20px");
    $(".job_card_title").css("animation", "TitleMoveLeft ease .5s 1");
    $(".job_flash_details").show();
    $(".job_flash_details").css("animation", "contentFadeOut ease-in-out .3s forwards");
    if(getContentChild.is(":hidden")){
      getContentChild.show("fast");
      getContentTitle.css("animation", "TitleMoveCenter ease-in-out .5s forwards");
      getContentFlash.hide("medium");
      getContentFlash.css("animation", "contentFadeIn ease-in-out .3s forwards");
    }else if(getContentChild.is(":visible")){
      getContentChild.hide("fast");
      getContentTitle.css("animation", "TitleMoveLeft ease-in-out .5s forwards");
      getContentFlash.show("medium");
      getContentFlash.css("animation", "contentFadeOut ease-in-out .3s forwards");
    }
  });

  $("#create_job_retrieve_address").click(function(){
    // getLocation();
    var location = localStorage.getItem("Location");
    $("#create_job_address").val(location);
  });

  $("#update_job_retrieve_address").click(function(){
    var location = ("#map_location").val();
    $("#update_job_address").val(location);
  });

  $("#create_job_start_clock_min").change(function(){
    var value = parseInt($(this).val());
    if(value > 59){
      $(this).val(59);
    }
  });
  
  $("#create_job_start_clock").change(function(){
    var value = parseInt($(this).val());
    if(value > 12){
      $(this).val(12);
    }
  });

  $("#create_job_end_clock_min").change(function(){
    var value = parseInt($(this).val());
    if(value > 59){
      $(this).val(59);
    }
  });

  $("#create_job_end_clock").change(function(){
    var value = parseInt($(this).val());
    if(value > 12){
      $(this).val(12);
    }
  });
  
  $("#exit_app").click(function () {
    var confrimBox = confirm("Are you sure?");
    if(confrimBox == true){
      if (navigator.app) {
          navigator.app.exitApp();
      } else if (navigator.device) {
          navigator.device.exitApp();
      } else {
          window.close();
      }
    }
  });

  $("#mapRefresh").click(function(){
    var lat = localStorage.getItem("jobLat");
    var lng = localStorage.getItem("jobLng");
    RefreshWayPoint(lat,lng);
  });

  $('#profile_phone').keypress(function(e) {
    var arr = [];
    var kk = e.which;
 
    for (i = 48; i < 58; i++)
        arr.push(i);
 
    if (!(arr.indexOf(kk)>=0))
        e.preventDefault();
  });
});
