	var ntfnd = 0; var center;var firebaseRef = new Firebase("https://beckrequest.firebaseio.com");
	var geoFire = new GeoFire(firebaseRef.child("_geopckgs")); var geoQuery = geoFire.query({center: [0,0],radius: 0});
	var vehiclesInQuery = {}; var img64; var autoflag=0; var deliveryFare, pickuplat,pickuplng, delvlat, delvlng, description=" ", pickuparea, pickupaddr, pickupname, pickupnum, deliveryaddr, deliveryarea, deliverynum, deliveryname,deliverydate,deliverytime, pckgvalue = "Less than Rs. 5000", pckgweight = "1 Kg - 10 Kgs",pckgsize = "SMALL (FITS IN BAG)";
	var pfare, psize, pweight, ppickup, ppickupaddr, pdelv,pdelvaddr,pdatetym,pckgimg,imagz, pusrid, pusrphn, porderid;
	var loggedin=0,usrname="",usremail="",usrphone="",usrid="", usrfbimg="", usrfbid="", fbflag=0, usrnewmail=""; var flgg=0;
	var otp; var otpmail; var locerr = 0; var hiname = 0; var acceptsloaded = 0; var fare =""; var conval = 1; var convcurr="INR";
	var newflg=0; var arrPckgs = []; var rsltshow = 0; var idpckgmatch; var arraccepts = []; var revrsdone = 0;
	app.controller('AppController', ["$scope", "$firebaseArray",
		
		function($scope, $firebaseArray) {
		$scope.post2 = function(){
			if(img64==""){}else{
			if(loggedin==1){ 
			if(usrphone=="" || usrphone==null || usrphone === undefined || usrphone === null){
			
				swal({title: "Mobile Verification", text: "",   type: "input",   showCancelButton: false,   closeOnConfirm: false,   animation: "slide-from-top",   inputPlaceholder: "Your 10-digit mobile number" }, 				
				function(inputValue){
				if((inputValue.length == 11) && (inputValue[0] == '0')){
					inputValue = inputValue.substr(1,inputValue.length);
				};
				var number = inputValue.replace(/[^\d]/g, '').length ;
				if (inputValue === false) return false; 
				if (number != 10) {swal.showInputError("Please Enter your 10 digit mobile number (without adding zero in the beginning) and select your country code");     return false   }
				var intno = String(document.getElementById("countrycd").value)+String(inputValue.replace(/[^\d]/g, ''));
				if(document.getElementById("countrycd").value == '91'){
					otpcall(intno);
				}else{
					otpintcall(intno);
				}						
				swal({title: "Enter OTP", text: "Please enter the 4 digit OTP sent as SMS",   type: "input",   showCancelButton: false,   closeOnConfirm: false,   animation: "slide-from-top",   inputPlaceholder: "OTP (One Time Password)" }, 
				function(inputValue2){
				var number = inputValue.replace(/[^\d]/g, '').length ;
				if (inputValue === false) return false; 
				if (otp != inputValue2) {     swal.showInputError("Please Enter the correct 4 digits");     return false   }
				firebaseRef.child("users").child(usrid).update({usrphone:intno}); usrphone = intno;
				swal("Mobile Verified", "Congratulations. You have registered your phone number with BECK!", "success"); loggedin = 1;	$('#myanchor').click();	
				})
				});	
				$(".sweet-alert p").html('<br>Please select your country and enter your mobile number<br>&nbsp;<br><select id="countrycd" style="padding:5px;font-size:14px;"><option data-countryCode="FR" value="33">France (+33)</option><option data-countryCode="DE" value="49">Germany (+49)</option><option data-countryCode="GR" value="30">Greece (+30)</option><option data-countryCode="HU" value="36">Hungary (+36)</option><option data-countryCode="IN" value="91" selected>India (+91)</option><option data-countryCode="ID" value="62">Indonesia (+62)</option><option data-countryCode="IT" value="39">Italy (+39)</option><option data-countryCode="JP" value="81">Japan (+81)</option><option data-countryCode="MY" value="60">Malaysia (+60)</option><option data-countryCode="MX" value="52">Mexico (+52)</option><option data-countryCode="MN" value="95">Myanmar (+95)</option><option data-countryCode="NL" value="31">Netherlands (+31)</option><option data-countryCode="NZ" value="64">New Zealand (+64)</option><option data-countryCode="PE" value="51">Peru (+51)</option><option data-countryCode="PH" value="63">Philippines (+63)</option><option data-countryCode="PL" value="48">Poland (+48)</option><option data-countryCode="RO" value="40">Romania (+40)</option><option data-countryCode="SG" value="65">Singapore (+65)</option><option data-countryCode="ZA" value="27">South Africa (+27)</option><option data-countryCode="ES" value="34">Spain (+34)</option><option data-countryCode="LK" value="94">Sri Lanka (+94)</option><option data-countryCode="SE" value="46">Sweden (+46)</option><option data-countryCode="CH" value="41">Switzerland (+41)</option><option data-countryCode="TH" value="66">Thailand (+66)</option><option data-countryCode="TR" value="90">Turkey (+90)</option><option data-countryCode="GB" value="44">UK (+44)</option></select>');			
			
			}
			else{post()}
			}	else{ 
			$('#signleft').click()
			//befrlogin()
			};
			}			
		}
		
		$scope.showprofile = function(value){
			window.open('http://www.fb.com/'+value.usrfbid,'_blank');
		}
		
		$scope.approvefrnd = function(id){			
			var number = $("input:radio[name='select']:checked").val();
			if(number === undefined){
				swal("Select a BECK FRIEND", "Please select the BECK friend who would complete your request")
			}else{
				var actionz = "BECK friend "+ $scope.acceptors[number].usrname +" was selected for order: " + idpckgmatch;
				myNavigator.pushPage('confirm.html', { animation : 'none' } );
				mailcall(actionz,$scope.acceptors[number].usrid,$scope.acceptors[number].usrphone);
				smsmatchsuppl($scope.acceptors[number].usrphone); 
				smsmatchdmnd(usrphone,$scope.acceptors[number].usrname,$scope.acceptors[number].usrphone);
				var otherid = $scope.acceptors[number].id;				
				firebaseRef.child("users").child(usrid).child("posts").child(idpckgmatch).update({"status":"Approved & Completed"});
				firebaseRef.child("users").child(otherid).child("accepts").child(idpckgmatch).update({"status":"Approved"}).then(function() {
					geoFire.remove(idpckgmatch);					
					setTimeout(function(){
		google.maps.event.trigger(map, 'resize');
		swal("Succesfully Connected", "The details of the BECK Friend you approved for this request has been sent you through SMS", "success");
		rfrshresults(map.getCenter());
		},2000);
					myNavigator.popPage('confirm.html', { animation : 'none' } ); myNavigator.popPage('track.html', { animation : 'none' } ); myNavigator.popPage('posted.html', { animation : 'none' } );
				});				
			}
		}
		
		$scope.fillboxes = function(detail){		
		imagz="";
		myNavigator.pushPage('track.html', { animation : 'push' } );
		setTimeout(function(){
		summbrk = 0;
		showsummprof();
		if(detail.status == 'Approved'){
			document.getElementById("tflpnmct").innerHTML = detail.pickupname + "<br>" + detail.pickupnum;
			document.getElementById("tfldnmct").innerHTML = detail.delvname + "<br>" + detail.delvnum;
			document.getElementById("pickupdivv").style.display="block";
			document.getElementById("delvdivv").style.display="block";
		}
		document.getElementById("accptrdiv").style.display="none";
		document.getElementById("appfrndbtn").style.display="none";
		document.getElementById("tflfare").innerHTML = detail.fare;
		document.getElementById("tsizewt").innerHTML = detail.weight+" "+detail.size;
		document.getElementById("tflpickarea").innerHTML = detail.pickup;
		document.getElementById("tflpickaddr").innerHTML = detail.pickupaddr;
		document.getElementById("tfldelv").innerHTML = detail.delv;
		document.getElementById("tfldelvaddr").innerHTML = detail.deliveryaddr;
		document.getElementById("tfldtym").innerHTML = detail.datetym;
		firebaseRef.child("packages").child(detail.id).child("img").once("value", function(dataSnapshot) {
			imagz = dataSnapshot.child("img64").val();
			$("#tflbckg").css("background-image", "url('" + imagz + "')");
		});
		},100)
		};
		
		$scope.fillboxes2 = function(detail){				
		if(detail.acceptors === undefined){
			$scope.acceptors = '';			
		}
		else{
			var obj = detail.acceptors; var dett = Object.keys(obj).map(function(k) { return obj[k] });
			$scope.acceptors = dett; 
			if(dett.length>0 && detail.status=="Waiting for Accept"){
				firebaseRef.child("users").child(usrid).child("posts").child(detail.id).update({status:"Waiting for Approval"});
			}
		}		
		imagz="";
		myNavigator.pushPage('track.html', { animation : 'push' } );
		setTimeout(function(){
			document.getElementById("tflpnmct").innerHTML = detail.pickupname + "<br>" + detail.pickupnum;
			document.getElementById("tfldnmct").innerHTML = detail.deliveryname + "<br>" + detail.deliverynum;
			document.getElementById("pickupdivv").style.display="block";
			document.getElementById("delvdivv").style.display="block";
		if(detail.acceptors === undefined){
			document.getElementById("accptrdiv").style.display="none";
			document.getElementById("appfrndbtn").style.display="none";
		}
		else if(detail.status=="Approved & Completed"){
			document.getElementById("accptrdiv").style.display="none";
			document.getElementById("appfrndbtn").style.display="none";
		}
		else{
			document.getElementById("accptrdiv").style.display="block";
			document.getElementById("appfrndbtn").style.display="block";
			idpckgmatch = detail.id;
		};	
		
		document.getElementById("tflfare").innerHTML = detail.fare;
		document.getElementById("tsizewt").innerHTML = detail.pckgweight+" , "+detail.pckgsize;
		document.getElementById("tflpickarea").innerHTML = detail.pickuparea;
		document.getElementById("tflpickaddr").innerHTML = detail.pickupaddr;
		document.getElementById("tfldelv").innerHTML = detail.deliveryarea;
		document.getElementById("tfldelvaddr").innerHTML = detail.deliveryaddr;
		document.getElementById("tfldtym").innerHTML = "By " + detail.deliverydate + " " + detail.deliverytime;
		firebaseRef.child("packages").child(detail.id).child("img").once("value", function(dataSnapshot) {
			imagz = dataSnapshot.child("img64").val();
			$("#tflbckg").css("background-image", "url('" + imagz + "')");
		});
		},100);
		}
				
		$scope.accept2 = function(){
		clicklogin=1;
		if(loggedin==1){
		if(usrfbid=="" || usrfbid==null || usrfbid === undefined || usrfbid === null){
			befrlogin();
		}else if(usrphone=="" || usrphone==null || usrphone === undefined || usrphone === null){
			
				swal({title: "Mobile Verification", text: "",   type: "input",   showCancelButton: false,   closeOnConfirm: false,   animation: "slide-from-top",   inputPlaceholder: "Your 10-digit mobile number" }, 				
				function(inputValue){
				if((inputValue.length == 11) && (inputValue[0] == '0')){
					inputValue = inputValue.substr(1,inputValue.length);
				};
				var number = inputValue.replace(/[^\d]/g, '').length ;
				if (inputValue === false) return false; 
				if (number != 10) {swal.showInputError("Please Enter your 10 digit mobile number (without adding zero in the beginning) and select your country code");     return false   }
				var intno = String(document.getElementById("countrycd").value)+String(inputValue.replace(/[^\d]/g, ''));
				if(document.getElementById("countrycd").value == '91'){
					otpcall(intno);
				}else{
					otpintcall(intno);
				}						
				swal({title: "Enter OTP", text: "Please enter the 4 digit OTP sent as SMS",   type: "input",   showCancelButton: false,   closeOnConfirm: false,   animation: "slide-from-top",   inputPlaceholder: "OTP (One Time Password)" }, 
				function(inputValue2){
				var number = inputValue.replace(/[^\d]/g, '').length ;
				if (inputValue === false) return false; 
				if (otp != inputValue2) {     swal.showInputError("Please Enter the correct 4 digits");     return false   }
				firebaseRef.child("users").child(usrid).update({usrphone:intno}); usrphone = intno;
				swal("Mobile Verified", "Congratulations. You have registered your phone number with BECK!", "success"); loggedin = 1;	$('#myanchor').click();	
				})
				});	
				$(".sweet-alert p").html('<br>Please select your country and enter your mobile number<br>&nbsp;<br><select id="countrycd" style="padding:5px;font-size:14px;"><option data-countryCode="FR" value="33">France (+33)</option><option data-countryCode="DE" value="49">Germany (+49)</option><option data-countryCode="GR" value="30">Greece (+30)</option><option data-countryCode="HU" value="36">Hungary (+36)</option><option data-countryCode="IN" value="91" selected>India (+91)</option><option data-countryCode="ID" value="62">Indonesia (+62)</option><option data-countryCode="IT" value="39">Italy (+39)</option><option data-countryCode="JP" value="81">Japan (+81)</option><option data-countryCode="MY" value="60">Malaysia (+60)</option><option data-countryCode="MX" value="52">Mexico (+52)</option><option data-countryCode="MN" value="95">Myanmar (+95)</option><option data-countryCode="NL" value="31">Netherlands (+31)</option><option data-countryCode="NZ" value="64">New Zealand (+64)</option><option data-countryCode="PE" value="51">Peru (+51)</option><option data-countryCode="PH" value="63">Philippines (+63)</option><option data-countryCode="PL" value="48">Poland (+48)</option><option data-countryCode="RO" value="40">Romania (+40)</option><option data-countryCode="SG" value="65">Singapore (+65)</option><option data-countryCode="ZA" value="27">South Africa (+27)</option><option data-countryCode="ES" value="34">Spain (+34)</option><option data-countryCode="LK" value="94">Sri Lanka (+94)</option><option data-countryCode="SE" value="46">Sweden (+46)</option><option data-countryCode="CH" value="41">Switzerland (+41)</option><option data-countryCode="TH" value="66">Thailand (+66)</option><option data-countryCode="TR" value="90">Turkey (+90)</option><option data-countryCode="GB" value="44">UK (+44)</option></select>');			
			
		}
		else{
		myNavigator.pushPage('accept.html', { animation : 'none' } );
		var interval = setInterval(function(){
		if(typeof usrid === 'undefined'){}
		else{
		clearInterval(interval);
		firebaseRef.child("users").child(usrid).child("accepts").child(arrPckgs[rsltshow].id).update(arrPckgs[rsltshow]);
		firebaseRef.child("users").child(usrid).child("accepts").update({notification:"yes"});
		firebaseRef.child("users").child(arrPckgs[rsltshow].usrid).child("posts").update({notification:"yes"});
		firebaseRef.child("users").child(arrPckgs[rsltshow].usrid).child("posts").child(arrPckgs[rsltshow].id).child("acceptors").child(usrid).update({id:usrid,usrname:usrname,usrphone:usrphone, usrfbid:usrfbid, usrfbimg:usrfbimg}).then(function() {
		smsacceptdm(arrPckgs[rsltshow].usrphn);smsacceptsupp(usrphone); var actionz = "BECK friend "+ usrname +" accepted a new order: " + arrPckgs[rsltshow].id; mailcall(actionz,usremail,usrphone);	
		myNavigator.popPage('accept.html', { animation : 'none' } );
		myNavigator.popPage('page4.html', { animation : 'none' } );
		google.maps.event.trigger(map, 'resize'); swal("Succesfully Accepted", "The details of the request you accepted has been sent you through SMS", "success");
  		rfrshresults(map.getCenter());
		})			
		};		
		},2000);	
		}		
		}
		else{
			fbflag = 1; $('#signleft').click()
			//befrlogin();
		}
		};
		
		var intervall = setInterval(function(){
		  if(loggedin == 1){
			clearInterval(intervall);			  
			$scope.accepts = $firebaseArray(firebaseRef.child("users").child(usrid).child("accepts"));
			$scope.accepts.$loaded().then(function(arr){
				for (var key in arr) {
					if(arr[key].$id === undefined){}else{
					arraccepts.push(arr[key].$id);
					}
				}
				acceptsloaded = 1;		
/*				
				if(arr.$getRecord("notification").$value == "no"){
					document.getElementById("notif1").style.display="none";
				}
				else{
					document.getElementById("notif1").style.display="inline";
					document.getElementById("notif").style.display="inline";
				}
				*/
			});
			$scope.posts = $firebaseArray(firebaseRef.child("users").child(usrid).child("posts"));
			$scope.posts.$loaded()
			.then(function(arr){
				var interval = setInterval(function(){
					if(revrsdone==1){
						clearInterval(interval);
						for (var key in arr) {
					if(arr[key].$id === undefined || arr[key].fare == 'GET QUOTE'){}else{
					arr[key].fare = convcurr+" "+ Math.round(Number(arr[key].fare)/conval);
					}
				}				
				}
				},1500);
/*				
				if(arr.$getRecord("notification").$value == "no"){
					document.getElementById("notif2").style.display="none";					
				}
				else{
					document.getElementById("notif2").style.display="inline";
					document.getElementById("notif").style.display="inline";
				}
				*/
			});
		  }
		},2000);	
		}
	]);
	
	jQuery(document).ready(function($){
		if (typeof history.pushState === "function") {
        history.pushState("jibberish", null, null);
        window.onpopstate = function () {
            history.pushState('newjibberish', null, null);
			if(newflg==0){
				newflg=1;
			}else{
				//sweetAlert("Oops...", "You were almost leaving BECK Friends?", "error");
			}            
        };
		}
	var $form_modal = $('.cd-user-modal'),
		$form_login = $form_modal.find('#cd-login'),
		$form_signup = $form_modal.find('#cd-signup'),
		$form_forgot_password = $form_modal.find('#cd-reset-password'),
		$form_modal_tab = $('.cd-switcher'),
		$tab_login = $form_modal_tab.children('li').eq(0).children('a'),
		$tab_signup = $form_modal_tab.children('li').eq(1).children('a'),
		$forgot_password_link = $form_login.find('.cd-form-bottom-message a'),
		$back_to_login_link = $form_forgot_password.find('.cd-form-bottom-message a'),
		$main_nav = $('#signleft'); // this is the id of the login button

	//open modal
	$main_nav.on('click', function(event){
		$form_modal.addClass('is-visible'); ( $(event.target).is('.cd-signup') ) ? signup_selected() : login_selected();
			/*
		if( $(event.target).is($main_nav) ) {
			// on mobile open the submenu
			$(this).children('ul').toggleClass('is-visible');
		} else {
			// on mobile close submenu
			$main_nav.children('ul').removeClass('is-visible');
			//show modal layer
			$form_modal.addClass('is-visible');	
			//show the selected form
			( $(event.target).is('.cd-signup') ) ? signup_selected() : login_selected();
		}
		*/
	});

	//close modal
	$('.cd-user-modal').on('click', function(event){
		if( $(event.target).is($form_modal) || $(event.target).is('.cd-close-form') ) {
			$form_modal.removeClass('is-visible');
		}	
	});
	//close modal when clicking the esc keyboard button
	$(document).keyup(function(event){
    	if(event.which=='27'){
    		$form_modal.removeClass('is-visible');
	    }
    });

	//switch from a tab to another
	$form_modal_tab.on('click', function(event) {
		event.preventDefault();
		( $(event.target).is( $tab_login ) ) ? login_selected() : signup_selected();
	});

	//hide or show password
	$('.hide-password').on('click', function(){
		var $this= $(this),
			$password_field = $this.prev('input');
		
		( 'password' == $password_field.attr('type') ) ? $password_field.attr('type', 'text') : $password_field.attr('type', 'password');
		( 'Hide' == $this.text() ) ? $this.text('Show') : $this.text('Hide');
		//focus and move cursor to the end of input field
		$password_field.putCursorAtEnd();
	});

	//show forgot-password form 
	$forgot_password_link.on('click', function(event){
		event.preventDefault();
		forgot_password_selected();
	});

	//back to login from the forgot-password form
	$back_to_login_link.on('click', function(event){
		event.preventDefault();
		login_selected();
	});

	function login_selected(){
		$form_login.addClass('is-selected');
		$form_signup.removeClass('is-selected');
		$form_forgot_password.removeClass('is-selected');
		$tab_login.addClass('selected');
		$tab_signup.removeClass('selected');
	}

	function signup_selected(){
		$form_login.removeClass('is-selected');
		$form_signup.addClass('is-selected');
		$form_forgot_password.removeClass('is-selected');
		$tab_login.removeClass('selected');
		$tab_signup.addClass('selected');
	}

	function forgot_password_selected(){
		$form_login.removeClass('is-selected');
		$form_signup.removeClass('is-selected');
		$form_forgot_password.addClass('is-selected');
	}

	//REMOVE THIS - it's just to show error messages 
	$form_login.find('input[type="submit"]').on('click', function(event){
		event.preventDefault();
		$form_login.find('input[type="email"]').toggleClass('has-error').next('span').toggleClass('is-visible');
	});
	$form_signup.find('input[type="submit"]').on('click', function(event){
		event.preventDefault();
		$form_signup.find('input[type="email"]').toggleClass('has-error').next('span').toggleClass('is-visible');
	});

});

jQuery.fn.putCursorAtEnd = function() {
	return this.each(function() {
    	// If this function exists...
    	if (this.setSelectionRange) {
      		var len = $(this).val().length * 2;
      		this.focus();
      		this.setSelectionRange(len, len);
    	} else {
    		// ... otherwise replace the contents with itself
    		// (Doesn't work in Google Chrome)
      		$(this).val($(this).val());
    	}
	});
};
	
	function openposts(){
		myNavigator.pushPage('posted.html', { animation : 'push' } );
		firebaseRef.child("users").child(usrid).child("posts").update({notification:"no"});
	}
	
	function openaccepts(){
		myNavigator.pushPage('schedule.html', { animation : 'push' } );
		firebaseRef.child("users").child(usrid).child("accepts").update({notification:"no"});
	}
	function tooclick(){
		
	}
	
	function performClick(elemId) {
   var elem = document.getElementById(elemId);
   if(elem && document.createEvent) {
      var evt = document.createEvent("MouseEvents");
      evt.initEvent("click", true, false);
      elem.dispatchEvent(evt);
   }
}
	function exit(){
		swal({   title: "Are you sure?",   text: "You will lose the data you added for this request",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Yes, go back",   closeOnConfirm: true }, function(){   myNavigator.popPage('page1.html', { animation : 'lift' } ); google.maps.event.trigger(map, 'resize'); });
	}
	
	  function smsmatchdmnd(number,name1,num1){
	if(String(number).substring(0, 2) == '91'){
	  $.ajax({
      url: 'https://www.beckme.in/otp.php',
      data:
      {
        phoneNumber : number,
        randomNumber : 'Your request has been accepted by your BECK friend '+String(name1).split(" ")[0].substring(0, 30)+'. You can reach him at '+num1
      },
      error: function(error) {
      //console.log(JSON.stringify(error));
        },
      success: function(data) {
        //console.log("01"+JSON.stringify(data));
       },
      type: 'POST'
	});
	}else{
	$.ajax({
      url: 'https://www.beckme.in/otpint.php',
      data:
      {
        phoneNumber : number,
        randomNumber : 'Your request has been accepted by your BECK friend '+String(name1).split(" ")[0].substring(0, 30)+'. You can reach him at '+num1
      },
      error: function(error) {
      //console.log(JSON.stringify(error));
        },
      success: function(data) {
       //console.log("02"+JSON.stringify(data));
       },
      type: 'POST'
	});
	}
	}
	
	function smsmatchsuppl(number){	
	if(String(number).substring(0, 2) == '91'){
	$.ajax({
      url: 'https://www.beckme.in/otp.php',
      data:
      {
        phoneNumber : number,
        randomNumber : 'Thanks for accepting the request of your BECK friend '+String(usrname).split(" ")[0].substring(0, 30)+'. You can reach him at '+usrphone
      },
      error: function(error) {
      //console.log(JSON.stringify(error));
        },
      success: function(data) {
      // console.log("11"+JSON.stringify(data));
       },
      type: 'POST'
	});
	}else{
	$.ajax({
      url: 'https://www.beckme.in/otpint.php',
      data:
      {
        phoneNumber : number,
        randomNumber : 'Thanks for accepting the request of your BECK friend '+String(usrname).split(" ")[0].substring(0, 30)+'. You can reach him at '+usrphone
      },
      error: function(error) {
      //console.log(JSON.stringify(error));
        },
      success: function(data) {
       //console.log("12"+JSON.stringify(data));
       },
      type: 'POST'
	});
	}
	}
	
	
	function mailconfirm(uemail){
	otpmail = Math.floor((Math.random() * 900) + 1000);
	$.ajax({
      url: 'https://www.beckme.in/mailverification.php',
      data:
      {
        code : otpmail,
		email : uemail
      },
      error: function(error) {
        },
      success: function(data) {
       },
      type: 'POST'
	});
	}
	
	function mailcall(custName,custEmail,custPhone){
	$.ajax({
      url: 'https://www.beckme.in/request.php',
      data:
      {
        name : custName,
		email : custEmail,
		phoneno : custPhone
      },
      error: function(error) {
      //console.log(JSON.stringify(error));
        },
      success: function(data) {
       // console.log("worked");
       },
      type: 'POST'
	});
	}
	
	$(document).on({
    'DOMNodeInserted': function() {
		$('.pac-item, .pac-item span', this).addClass('needsclick');
    }
	}, '.pac-container');
		
	var nofkeys=0;
	geoQuery.on("key_entered", function(vehicleId, vehicleLocation) {
	vehiclesInQuery[vehicleId] = true;
	firebaseRef.child("packages").child(vehicleId).once("value", function(dataSnapshot) {
    vehicle = dataSnapshot.val();
	if (vehicle !== null && vehiclesInQuery[vehicleId] === true) {
    vehiclesInQuery[vehicleId] = vehicle;
	createVehicleMarker(vehicle,vehicleId);
	}	
	});
  });


function isValidDate(dateString) {
  var regEx = /^\d{4}-\d{2}-\d{2}$/;
  return dateString.match(regEx) != null;
}

function forcekeyexit(vehicleId){
	var vehicle = vehiclesInQuery[vehicleId];
	if(vehicle !== undefined){
  if (vehicle !== true) {
   // vehicle.marker.setMap(null);
	findAndRemove(arrPckgs, 'id', vehicleId);
  }
  delete vehiclesInQuery[vehicleId];
	}
}

geoQuery.on("key_exited", function(vehicleId, vehicleLocation) {
  forcekeyexit(vehicleId);  
})
	
	
	function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition,onerror,{maximumAge:600000});
    }
	}
	
	function shownext(){
		if((rsltshow+1)<nofkeys){
			rsltshow++;
			showreslt(rsltshow);
			drawroute(arrPckgs[rsltshow].pickuplat, arrPckgs[rsltshow].pickuplng, arrPckgs[rsltshow].delvlat, arrPckgs[rsltshow].delvlng);
		}		
		
	}
	
	function showprev(){
		if(rsltshow>0){
			rsltshow--;
			showreslt(rsltshow);
			drawroute(arrPckgs[rsltshow].pickuplat, arrPckgs[rsltshow].pickuplng, arrPckgs[rsltshow].delvlat, arrPckgs[rsltshow].delvlng);
		}			
	}
	
	var path = null;
	var hotSpotMapMarkers = [];
	
	function drawroute(picklat,picklng,delvlat,delvlng){	
	for (var i = 0; i < hotSpotMapMarkers.length; i++)
    hotSpotMapMarkers[i].setMap(null);
	var flightPlanCoordinates = [{lat:picklat,lng:picklng},{lat:delvlat,lng:delvlng}];
	var latlngbounds = new google.maps.LatLngBounds();
	latlngbounds.extend(new google.maps.LatLng(picklat,picklng));
	latlngbounds.extend(new google.maps.LatLng(delvlat,delvlng));
	
	var polyLine = new google.maps.Polyline({
    path: flightPlanCoordinates,
    strokeColor: "#2bb1de",
	strokeWeight: 2,
	geodesic:true
	});
	var prepath = path;
	if(prepath){prepath.setMap(null);
	}
	polyLine.setMap(map);
	path = polyLine;
	hotSpotMapMarkers.push(new google.maps.Marker({
    position: new google.maps.LatLng(picklat, picklng),
    optimized: true,
	icon: "package_green.png",
    map: map
	}));
	hotSpotMapMarkers.push(new google.maps.Marker({
    position: new google.maps.LatLng(delvlat, delvlng),
    optimized: true,
	icon: "package_red.png",
    map: map
	}));
	map.fitBounds(latlngbounds);
	}
	
	function showreslt(i){
	if(i<nofkeys){
		document.getElementById("pckgctr").innerHTML = (i+1) +" of " + nofkeys;
	}
	if(nofkeys==1){
		document.getElementById("prevbtn").style.display="none"; document.getElementById("nxtbtn").style.display="none";
	}
	else{
	if(i==0){
		document.getElementById("prevbtn").style.display="none";
	}else{
		document.getElementById("prevbtn").style.display="inline";
	}
	if(i == nofkeys-1){
		document.getElementById("nxtbtn").style.display="none";
	}else{
		document.getElementById("nxtbtn").style.display="inline";
	}	
	}
	document.getElementById("pfare").innerHTML = arrPckgs[i].fare;
	document.getElementById("psize").innerHTML = arrPckgs[i].size;
	document.getElementById("pdatetym").innerHTML = arrPckgs[i].datetym;
	document.getElementById("ppickup").innerHTML = arrPckgs[i].pickup;	
	document.getElementById("pdelv").innerHTML = arrPckgs[i].delv;	
	document.getElementById("rqstgist").style.display="block";
	
	if(i==0){
		document.getElementById("map").style.height = 'calc(100% - '+(document.getElementById('rqstgist').clientHeight+140)+'px)'
		google.maps.event.trigger(map, 'resize');
	}
	map.setZoom(15);
	map.panTo(new google.maps.LatLng(arrPckgs[i].pickuplat, arrPckgs[i].pickuplng));
	
	}
	
	function openaccept(){
		imagz="";
		myNavigator.pushPage('page4.html', { animation : 'push' } );
		setTimeout(function(){ 
		document.getElementById("pflfare").innerHTML = arrPckgs[rsltshow].fare;
		document.getElementById("psizewt").innerHTML = arrPckgs[rsltshow].weight+" "+arrPckgs[rsltshow].size;
		document.getElementById("pflpickarea").innerHTML = arrPckgs[rsltshow].pickup;
		//document.getElementById("pflpickaddr").innerHTML = arrPckgs[rsltshow].pickupaddr;
		document.getElementById("pfldelv").innerHTML = arrPckgs[rsltshow].delv;
		//document.getElementById("pfldelvaddr").innerHTML = arrPckgs[rsltshow].deliveryaddr;
		document.getElementById("pfldtym").innerHTML = arrPckgs[rsltshow].datetym;
		imagz = arrPckgs[rsltshow].img;
		$("#pflbckg").css("background-image", "url('" + imagz + "')");
		},100);
	}
	
	function createVehicleMarker(vehicle,vehicleId) {	
	var nwfr;
	if(vehicle.order.fare != "GET QUOTE"){
		nwfr = convcurr+" "+String(Math.round((vehicle.order.fare)/conval));	
	}else{
		nwfr = "GET QUOTE";
	}
	arrPckgs.push({
		status:"Not Approved Yet",
		img: vehicle.img.img64,
		id: vehicle.order.id,
		fare: nwfr,
		pickuplat: vehicle.order.pickuplat,
		pickuplng: vehicle.order.pickuplng,
		delvlat: vehicle.order.delvlat,
		delvlng: vehicle.order.delvlng,
		delv: vehicle.order.deliveryarea,
		size: vehicle.order.pckgsize,
		weight:vehicle.order.pckgweight,
		date: vehicle.order.deliverydate,
		time: vehicle.order.deliverytime,
		datetym: "By "+vehicle.order.deliverydate+" " + vehicle.order.deliverytime,
		pickup: vehicle.order.pickuparea,
		pickupname: vehicle.order.pickupname,
		pickupnum: vehicle.order.pickupnum,
		delvname: vehicle.order.deliveryname,
		delvnum: vehicle.order.deliverynum,		
		pickupaddr: vehicle.order.pickupaddr,
		deliveryaddr: vehicle.order.deliveryaddr,
		usrid: vehicle.order.usrid,
        usrname: vehicle.order.usrname,
		usrphn: vehicle.order.usrphone,
        sortable: true
    });
	}
	
	function getReverseGeocodingData(lat, lng) {
    var latlng = new google.maps.LatLng(lat, lng);
    // This is making the Geocode request
    var geocoder = new google.maps.Geocoder();
	// geoPosition.getCurrentPosition(function(r){
        var findResult = function(results, name){
            var result =  _.find(results, function(obj){
                return obj.types[0] == name && obj.types[1] == "political";
            });
            return result ? result.short_name : null;
        };
    geocoder.geocode({ 'latLng': latlng }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var address = (results[0].formatted_address);
			if(ntfnd==1){
				ntfnd=0;
			}else{
			document.getElementById("locasion").innerHTML = address;				
			}
			var country = findResult(results[0].address_components, "country");
			if(country == 'IN'){
				conval = 1; convcurr = "INR";
			}else if(country == "IT" || country == "GR" || country == "FR" || country == "ES" || country == "PL" || country == "BE" || country == "DE" ||country == "IE" || country == "PT" || country == "CH" || country == "TR" || country == "UA" || country == "DK" || country == "NL"){
				conval = 70; convcurr = "EUR";
			}else if(country == "GB"){
				conval = 90; convcurr = "GBP";
			}else if(country == "JP"){
				conval = 0.6; convcurr = "JPY";
			}else{
				conval = 60; convcurr = "USD";
			}
			revrsdone = 1;
        }
    });
	}
	
	function findAndRemove(array, property, value) {
	array.forEach(function(result, index) {
    if(result[property] === value) {
      array.splice(index, 1);
    }    
	});
	}
	
	function insurance(){
		if (document.getElementById('chkbx').checked) {
      document.getElementById('chkval').innerHTML = "More than Rs. 5000";
	  pckgvalue = "More than Rs. 5000";
		} else { document.getElementById('chkval').innerHTML = "Less than Rs. 5000";
		pckgvalue = "Less than Rs. 5000";
		}
	}
	
	function showVal(newVal){
		var cars = ["","Less than 1 Kg", "1 Kg - 10 Kgs", "10 Kgs to 20 Kgs", "20 Kgs - 30 Kgs", "Above 20 Kgs"];
		document.getElementById("rangeText").innerHTML=cars[newVal]; pckgweight = cars[newVal];
	}
	

	function showPosition(position) {			
		map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
		setTimeout('$("body").css("visibility","visible");', 1000);
		map.setZoom(11); ntfnd = 0;		
		getReverseGeocodingData(position.coords.latitude, position.coords.longitude);
		showtour();		
		geoQuery.updateCriteria({center: [position.coords.latitude, position.coords.longitude],  radius: 30});
	}
	 
	function showtour(){		
		var tourinterval = setInterval(function(){
		if(hiname == 1){
		var tour = new Tour({
        storage: false,		
		steps: [
         {
    orphan: true,
    title: "What is BECK Friends?",
	backdrop:true,
    content: "A global peer-to-peer marketplace for sending anything anywhere economically with an opportunity to earn as you travel"
  },   {
    element: "#locasion", 
    title: "Change Locations",
	placement: "bottom",
	backdrop:true,
    content: "Search various places to see the Requests there"
  },
  {
    element: "#map", 
    title: "Live Requests",
	placement: "bottom",
	backdrop:true,
    content: "The details of Live Requests appear here. Use the left and right arrow to navigate across them"
  },
  {
    element: "#add",
    title: "New Request",
	placement: "bottom",
	backdrop:true,
    content: "You can post a Request when you want to send"
  },
  {
    element: "#mnulft",
    title: "Menu",	
	placement: "bottom",
	backdrop:true,
    content: "You can edit your profile & look at the details of previous requests"
  },
  {
    element: "#signleft",
    title: "Login",	
	placement: "bottom",
	backdrop:true,
    content: "Finally, Login with Facebook for posting with us"
  }
        ]
    }).init().start(true);   
	clearInterval(tourinterval);
		}
		else{}
		},1000);
	}
   
	function onerror(err){		
		ntfnd = 1;setTimeout('$("body").css("visibility","visible");', 1000); loadauto2();			
	}
	
	function loadauto2(){
	myNavigator.pushPage('page5.html', { animation : 'none' } );	
	setTimeout(function(){
	var input = (document.getElementById('pac-input2'));
	var autocomplete = new google.maps.places.Autocomplete(input);	
	autocomplete.addListener('place_changed', function() {
	var place = autocomplete.getPlace();
	if (!place.geometry) {
		swal({   title: "Location Error",   text: "Sorry could not find the location. Please search again",   type: "error",   confirmButtonText: "OK" });
       myNavigator.popPage('page5.html', { animation : 'none' } );	
    }
   
	center = place.geometry.location;    
    var address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
		(place.address_components[1] && place.address_components[1].short_name || ''), 
        (place.address_components[2] && place.address_components[2].short_name || '')      
      ].join(' ');
	  getReverseGeocodingData(center.lat(), center.lng());
	document.getElementById("locasion").innerHTML=address;
	 map.setCenter(center);map.setZoom(11); //ntfnd=0;
	myNavigator.popPage('page5.html', { animation : 'none' } );	
	setTimeout(function(){
		  google.maps.event.trigger(map, 'resize');
		 map.setCenter(center);map.setZoom(11);
		  geoQuery.updateCriteria({center: [center.lat(), center.lng()],  radius: 30});
		 showtour();
	  },1500)
    }	
	});		
	},1000);	
	}
	var markrz1,markrz2;
	/*
	geoQuery.on("ready", function() {
	nofkeys = Object.keys(vehiclesInQuery).length;
	if(nofkeys==0 && geoQuery.radius()>1){
		if(geoQuery.radius()==30){
			geoQuery.updateCriteria({radius: 300});
		}else if(geoQuery.radius()==300){
			geoQuery.updateCriteria({radius: 700});
		}else if(geoQuery.radius()==700){
			geoQuery.updateCriteria({radius: 1000});
		}else if(geoQuery.radius()==1000){
			geoQuery.updateCriteria({radius: 1500});
		}else if(geoQuery.radius()==1500){
			geoQuery.updateCriteria({radius: 3500});
		}else if(geoQuery.radius()==3500){
			geoQuery.updateCriteria({radius: 5000});
		}else{
		setTimeout(function(){swal({   title: "No Live Requests",   text: "Presently there are no live requests around this location. You can add a request here if you want or search live requests for another location",   timer: 8000 })},5000);		
		}
		
	}
	var interval = setInterval(function(){
	if(arrPckgs.length == nofkeys && nofkeys!=0 && acceptsloaded==1){			
		clearInterval(interval);
		for (var key in arraccepts) {forcekeyexit(arraccepts[key])};
		arrPckgs.sort(function(a, b) {
			if(String(b.fare).split(" ")[1]=="QUOTE"){
				return 0 - parseInt(Number(String(a.fare).split(" ")[1]));
			}else if(String(a.fare).split(" ")[1]=="QUOTE"){
				return parseInt(Number(String(b.fare).split(" ")[1])) - 0;
			}
			else{
				return parseInt(Number(String(b.fare).split(" ")[1])) - parseInt(Number(String(a.fare).split(" ")[1]));
			}		
		});
		nofkeys = arrPckgs.length;
		if(nofkeys==0){
			swal({   title: "No New Packages Here",   text: "You have accepted all packages near this location. Please come back later or continue searching for other locations.",   type: "error",   confirmButtonText: "OK" });
    	}else{
			document.getElementById("prevbtn").style.display="none"; showreslt(0);
			drawroute(arrPckgs[0].pickuplat, arrPckgs[0].pickuplng, arrPckgs[0].delvlat, arrPckgs[0].delvlng);	
		}
		
	}	
	
	},3000);
	});	
	*/
		geoQuery.on("ready", function() {
	nofkeys = Object.keys(vehiclesInQuery).length;
	if(nofkeys==0 && geoQuery.radius()>1){
		if (geoQuery.radius()==15){
			geoQuery.updateCriteria({radius: 30});
		}else if (geoQuery.radius()==30){
			geoQuery.updateCriteria({radius: 300});
		}else if(geoQuery.radius()==300){
			geoQuery.updateCriteria({radius: 700});
		}else if(geoQuery.radius()==700){
			geoQuery.updateCriteria({radius: 1000});
		}else if(geoQuery.radius()==1000){
			geoQuery.updateCriteria({radius: 1500});
		}else if(geoQuery.radius()==1500){
			geoQuery.updateCriteria({radius: 3500});
		}else if(geoQuery.radius()==3500){
			geoQuery.updateCriteria({radius: 5000});
		}else{
			$('#map').plainOverlay('hide');
		setTimeout(function(){swal({   title: "No Live Requests",   text: "Presently there are no live requests around this location. You can add a request here if you want or search live requests for another location",   timer: 8000 });
		document.getElementById("pckgctr").innerHTML = "No Requests Found"},3000);
		document.getElementById("rqstgist").style.display="none";
		}
		
	}
	var interval = setInterval(function(){
	if(arrPckgs.length == nofkeys && nofkeys!=0 && acceptsloaded==1){			
		clearInterval(interval);
		if(flgg==0)
		{
		$('#map').plainOverlay('show',{
			opacity:0.8,
			fillColor: '#000',
			progress: function() { return $('<div style="font-size:26px;color:#fff;font-weight:bold;text-align:center">Customizing Requests<br> for your account...</div>'); }
		});
			flgg=1;
		}
		for (var key in arraccepts) {forcekeyexit(arraccepts[key])};
		arrPckgs.sort(function(a, b) {
			if(String(b.fare).split(" ")[1]=="QUOTE"){
				return 0 - parseInt(Number(String(a.fare).split(" ")[1]));
			}else if(String(a.fare).split(" ")[1]=="QUOTE"){
				return parseInt(Number(String(b.fare).split(" ")[1])) - 0;
			}
			else{
				return parseInt(Number(String(b.fare).split(" ")[1])) - parseInt(Number(String(a.fare).split(" ")[1]));
			}		
		});
		nofkeys = arrPckgs.length;
		if(nofkeys==0){
			document.getElementById("pckgctr").innerHTML = "Searching More...";
			document.getElementById("rqstgist").style.display="none";
			rfrshresults(mycenter);
			for (var i = 0; i < hotSpotMapMarkers.length; i++)
			hotSpotMapMarkers[i].setMap(null);
		   google.maps.event.trigger(map, 'resize');
		  rsltshow = 0;
		  if(path) path.setMap(null);
		  map.setCenter(mycenter);map.setZoom(12);ntfnd=0;
			if(geoQuery.radius()==30){
			geoQuery.updateCriteria({radius: 300});
		}else if(geoQuery.radius()==300){
			geoQuery.updateCriteria({radius: 700});
		}else if(geoQuery.radius()==700){
			geoQuery.updateCriteria({radius: 1000});
		}else if(geoQuery.radius()==1000){
			geoQuery.updateCriteria({radius: 1500});
		}else if(geoQuery.radius()==1500){
			geoQuery.updateCriteria({radius: 3500});
		}else if(geoQuery.radius()==3500){
			geoQuery.updateCriteria({radius: 5000});
		}else{
			$('#map').plainOverlay('hide');
			document.getElementById("pckgctr").innerHTML = "No Requests Found";
		setTimeout(function(){swal({   title: "No Live Requests",   text: "Presently there are no live requests around this location. You can add a request here if you want or search live requests for another location",   timer: 8000 })},3000);		
		}	
    	}else{
			$('#map').plainOverlay('hide');
			document.getElementById("prevbtn").style.display="none"; showreslt(0);
			drawroute(arrPckgs[0].pickuplat, arrPckgs[0].pickuplng, arrPckgs[0].delvlat, arrPckgs[0].delvlng);	
		}
		
	}	
	
	},3000);
	});	
	
	function rfrshresults(center){
			for (var i = 0; i < hotSpotMapMarkers.length; i++)
			hotSpotMapMarkers[i].setMap(null);
		  document.getElementById("rqstgist").style.display="none";
		  document.getElementById("map").style.height = '100%';
		  google.maps.event.trigger(map, 'resize');
		  rsltshow = 0;
		  path.setMap(null);
		  map.setCenter(center);map.setZoom(12); ntfnd=0;
		  geoQuery.updateCriteria({center: [center.lat(), center.lng()],radius:30});
    }
	
	var img="";
	function loadauto(){
	myNavigator.pushPage('page3.html', { animation : 'lift' } );		
	setTimeout(function(){
	var input = (document.getElementById('pac-input'));
	var autocomplete = new google.maps.places.Autocomplete(input);	
	autocomplete.addListener('place_changed', function() {	
	var place = autocomplete.getPlace();
	if (!place.geometry) {
	swal({   title: "Location Error",   text: "Sorry could not find the location. Please search again",   type: "error",   confirmButtonText: "OK" });
    myNavigator.popPage('page3.html', { animation : 'lift' } );	
    }
   
	center = place.geometry.location;    
    var address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
		(place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].short_name || '')      
      ].join(' ');
	  if(autoflag==0)
	  {
		document.getElementById("locasion").innerHTML = document.getElementById("pac-input").value;
	  myNavigator.popPage('page3.html', { animation : 'lift' } );
	  
	  setTimeout(function(){		  
		rfrshresults(center);
	  },1500)
	}
	else if(autoflag==1){
		document.getElementById("pickuparea").value=document.getElementById("pac-input").value;
		pickuplat = Number((String(center.lat()).split(".")[0])+"."+String((String(center.lat()).split(".")[1]).substr(0,2)+Math.floor(Math.random() * 100)));
		pickuplng = Number(center.lng());
		myNavigator.popPage('page3.html', { animation : 'lift' } );	
	}
	else if(autoflag==2){
		document.getElementById("deliveryarea").value=document.getElementById("pac-input").value;;
		delvlat = center.lat(); delvlng = center.lng();
		myNavigator.popPage('page3.html', { animation : 'lift' } );
	}
    }	
	});	
	
	},1000);
	
	}
	
	function startauto(){
		autoflag=0;
		loadauto()
	}
	
	function pickupauto(){
		autoflag=1;
		loadauto()
	}
	
	function delvauto(){
		autoflag=2;
		loadauto()
	}
	
	var farebrk = 0;
	function showsumm(){		
		if(farebrk==0){
		document.getElementById("summhd").innerHTML = 'HIDE SUMMARY';document.getElementById("summicndwn").style.display="inline";
		document.getElementById("summary").style.display="inline";document.getElementById("summicnryt").style.display="none";
		farebrk = 1;
		}
		else{
		document.getElementById("summhd").innerHTML = 'SHOW SUMMARY';document.getElementById("summicndwn").style.display="none";
		document.getElementById("summary").style.display="none";document.getElementById("summicnryt").style.display="inline";
		farebrk = 0;
		}		
	}
	
	var summbrk = 0;
	function showsummprof(){		
		if(summbrk==0){
		document.getElementById("summhdprf").innerHTML = 'HIDE SUMMARY';document.getElementById("summicndwnprf").style.display="inline";
		document.getElementById("summaryprf").style.display="inline";document.getElementById("summicnrytprf").style.display="none";
		summbrk = 1;
		}
		else{
		document.getElementById("summhdprf").innerHTML = 'SHOW SUMMARY';document.getElementById("summicndwnprf").style.display="none";
		document.getElementById("summaryprf").style.display="none";document.getElementById("summicnrytprf").style.display="inline";
		summbrk = 0;
		}		
	}
	
	function receipt(){
		phoneNumDelv = document.getElementById("deliverynum").value.replace(/[^\d]/g, '');
		if(document.getElementById('deliveryarea').value=="" || document.getElementById('deliveryname').value=="" || document.getElementById('deliverynum').value=="" || document.getElementById('deliveryaddr').value==""){
			swal({   title: "DELIVERY DETAILS",   text: "Please fill all Pickup Details",   type: "error",   confirmButtonText: "OK" });
		}		
		else if(phoneNumDelv.length < 10) {
			swal({   title: "INVALID MOBILE NO.",   text: "Please enter a valid 10-digit mobile number at delivery location",   type: "error",   confirmButtonText: "OK" });
		}
		else if(img===undefined || img == ""){
			swal({   title: "ADD PACKAGE PHOTO",   text: "Please add photo of your package at the top",   type: "error",   confirmButtonText: "OK" });
		}		
		else{
			deliveryarea = document.getElementById("deliveryarea").value;
			deliveryname = document.getElementById("deliveryname").value;
			deliverynum = document.getElementById("deliverynum").value;
			deliveryaddr = document.getElementById("deliveryaddr").value;
			deliverydate = document.getElementById("myDate").value;
			deliverytime = document.getElementById("myTime").value;			
			var oneDay = 24*60*60*1000;
			var firstDate = new Date(today);
			var secondDate = new Date(deliverydate);
			var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));					
			var distance = Number(GeoFire.distance([pickuplat,pickuplng], [delvlat,delvlng]));			
			if(distance<=2000){	
		var pickupLocation = pickuplat+", "+pickuplng; var deliveryLocation = delvlat+", "+delvlng;
		var request = {
       origin: pickupLocation, 
       destination: deliveryLocation,
       travelMode: google.maps.DirectionsTravelMode.DRIVING 
   };	
	directionsService.route(request, function(response, status) {
	
	if (status == google.maps.DirectionsStatus.OK) { 
		var route = Number(response.routes[0].legs[0].distance.value);
	if(distance<=60){	
		if(diffDays==0){
				if(pckgsize == 'SMALL (FITS IN BAG)'){
					fare=String(Math.round(route*0.008));
				}
				else if(pckgsize == 'MEDIUM (FITS IN CAR)'){
					fare=String(Math.round(route*0.01));
				}
				else if(pckgsize == 'LARGE (FITS IN VAN)'){
					fare=String(Math.round(route*0.014));
				}
				else{
					fare=String(Math.round(route*0.024));
				}				
			}
			else if(diffDays>=1 && diffDays<=3){
				if(pckgsize == 'SMALL (FITS IN BAG)'){
					fare=String(Math.round(route*0.007));
				}
				else if(pckgsize == 'MEDIUM (FITS IN CAR)'){
					fare=String(Math.round(route*0.009));
				}
				else if(pckgsize == 'LARGE (FITS IN VAN)'){
					fare=String(Math.round(route*0.012));
				}
				else{
					fare=String(Math.round(route*0.021));
				}				
			}else if(diffDays>3 && diffDays<=7){
				if(pckgsize == 'SMALL (FITS IN BAG)'){
					fare=String(Math.round(route*0.005));
				}
				else if(pckgsize == 'MEDIUM (FITS IN CAR)'){
					fare=String(Math.round(route*0.007));
				}
				else if(pckgsize == 'LARGE (FITS IN VAN)'){
					fare=String(Math.round(route*0.008));
				}
				else{
					fare=String(Math.round(route*0.015));
				}					
			}else{
				if(pckgsize == 'SMALL (FITS IN BAG)'){
					fare=String(Math.round(route*0.004));
				}
				else if(pckgsize == 'MEDIUM (FITS IN CAR)'){
					fare=String(Math.round(route*0.005));
				}
				else if(pckgsize == 'LARGE (FITS IN VAN)'){
					fare=String(Math.round(route*0.007));
				}
				else{
					fare=String(Math.round(route*0.012));
				}					
			}
	}
	else{
	if(diffDays==0){			
				if(pckgsize == 'SMALL (FITS IN BAG)'){
					fare=String(Math.round(200 + distance*0.75));
				}				
				else{
					fare="GET QUOTE";
				}				
			}
			else if(diffDays>0 && diffDays<=3){				
				if(pckgsize == 'SMALL (FITS IN BAG)'){
					fare=String(Math.round(175 + distance*0.5));
				}
				else{
					fare="GET QUOTE";
				}					
			}else if(diffDays>3 && diffDays<=7){				
				if(pckgsize == 'SMALL (FITS IN BAG)'){
					fare=String(Math.round(150 + distance*0.5));
				}
				else{
					fare="GET QUOTE";
				}					
			}else{				
				if(pckgsize == 'SMALL (FITS IN BAG)'){
					fare=String(Math.round(125 + distance*0.25));
				}
				else{
					fare="GET QUOTE";
				}					
			}
	}   
   }})						
			}else{
			if(diffDays<3){
				if(pckgsize == 'SMALL (FITS IN BAG)'){
					fare=String(Math.round(distance*0.75));
				}else{
					fare="GET QUOTE";
				}				
			}
			else if(diffDays>=3 && diffDays<=7){
				if(pckgsize == 'SMALL (FITS IN BAG)'){
					fare=String(Math.round(distance*0.5));
				}else{
					fare="GET QUOTE";
				}			
			}else if(diffDays>7 && diffDays<=31){
				if(pckgsize == 'SMALL (FITS IN BAG)'){
					fare=String(Math.round(distance*0.4));
				}else{
					fare="GET QUOTE";
				}				
			}else{
				if(pckgsize == 'SMALL (FITS IN BAG)'){
					fare=String(Math.round(distance*0.25));
				}else{
					fare="GET QUOTE";
				}				
			}
			};	
			myNavigator.pushPage('page2.html', { animation : 'push' } );
			setTimeout(function(){
				var newfrconv = "";
				if(fare!="GET QUOTE"){
				newfrconv = convcurr+" "+ Math.round(fare/conval);
				}
				else{
				newfrconv = "GET QUOTE";
				}
				document.getElementById("fare").innerHTML = newfrconv;
				document.getElementById("postbtn").style.display = "block";
				document.getElementById("card2").style.backgroundImage = "url('"+img64+"')";
				document.getElementById("pickupareasumm").innerHTML = pickuparea;
				document.getElementById("pickupdetsumm").innerHTML = pickupaddr;
				document.getElementById("delvareasumm").innerHTML = deliveryarea;
				document.getElementById("delvdetsumm").innerHTML = deliveryaddr;
				document.getElementById("datetymsumm").innerHTML =  deliverytime+" on "+deliverydate;
			},3500)			
		}		
	}
	
	function resizeImage(img) {
    img64 = imageToDataUri(img);		
	if(img64=="data:,"||img64=="data:image/jpeg;"){
		img64="";
		sweetAlert("Oops...", "There is some problem with this image. Please select the image again or another one that is similar", "error");
	}else{
		document.getElementById("packagephoto").style.display = "none";
        document.getElementById("card").style.backgroundImage = "url('"+img64+"')";
		document.getElementById("card").style.backgroundSize = "contain"; document.getElementById("card").style.backgroundPosition = "center"; document.getElementById("card").style.backgroundRepeat = "no-repeat";
	
	}
	}
		
	var phoneNumPick, phoneNumDelv;
	function showdelivery(){
		phoneNumPick = document.getElementById("pickupnum").value.replace(/[^\d]/g, '');
		if(document.getElementById('pickuparea').value=="" || document.getElementById('pickupname').value=="" || document.getElementById('pickupnum').value=="" || document.getElementById('pickupaddr').value==""){
			swal({   title: "PICKUP DETAILS",   text: "Please fill all Pickup Details",   type: "error",   confirmButtonText: "OK" });
		}		
		else if(phoneNumPick.length < 10) {
			swal({   title: "INVALID MOBILE NO.",   text: "Please enter a valid 10-digit mobile number at pickup location",   type: "error",   confirmButtonText: "OK" });
		}
		else{
		pickuparea = document.getElementById("pickuparea").value;
		pickupname = document.getElementById("pickupname").value;
		pickupnum = document.getElementById("pickupnum").value;
		pickupaddr = document.getElementById("pickupaddr").value;
		document.getElementById("packagedetails").style.display="none";
		document.getElementById("pickupdetails").style.display="none";
		document.getElementById("deliverydetails").style.display="block";
		document.getElementById("timebtn").style.background="#00b100";		
		document.getElementById("pickupbtn").style.background="#00b100";
		document.getElementById("deliverybtn").style.background="#00b100";
		document.getElementById("timedetails").style.display="none";
		}		
	}
	
	function makeid(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
	}
	
	function tConvert (time) {
	time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
	if (time.length > 1) {
    time = time.slice (1);
    time[5] = +time[0] < 12 ? 'am' : 'pm';
    time[0] = +time[0] % 12 || 12;
	}
	return time.join ('');
	}
	
	function reformatDate(dateStr){
	dArr = dateStr.split("-");
	return dArr[2]+ "/" +dArr[1]+ "/" +dArr[0];
	}
		
	var fbflag,clicklogin=0;
	
	function editnum(){
		if(loggedin==1){swal({   title: "Change number",   text: "Your present registered number is +"+usrphone+". Are you sure you want to change it?", html: true,   type: "warning",   showCancelButton: true,   confirmButtonColor: "#2bb1de",   confirmButtonText: "Change it",   closeOnConfirm: false }, function(){ smsending() })}else{sidebar.toggleMenu();$('#signleft').click()};
	}	
	
	function smsending(){
		if(loggedin==1){
				swal({title: "Mobile Verification", text: "", type: "input", closeOnConfirm: false, animation: "slide-from-top",   inputPlaceholder: "Your 10-digit mobile number" }, 				
				function(inputValue){
				if((inputValue.length == 11) && (inputValue[0] == '0')){
					inputValue = inputValue.substr(1,inputValue.length);
				};
				var number = inputValue.replace(/[^\d]/g, '').length;
				if (inputValue === false) return false; 
				if (number != 10) {swal.showInputError("Please Enter your 10 digit mobile number (without adding zero in the beginning) and select your country code");     return false   }
				if (String(document.getElementById("countrycd").value)+String(inputValue.replace(/[^\d]/g, '')) == String(usrphone)) {swal.showInputError("Please do not enter the existing registered mobile number");     return false   }
				var intno = String(document.getElementById("countrycd").value)+String(inputValue.replace(/[^\d]/g, ''));
				if(document.getElementById("countrycd").value == '91'){
					otpcall(intno);
				}else{
					otpintcall(intno);
				}
						
				swal({title: "Enter OTP", text: "Please enter the 4 digit OTP sent as SMS",   type: "input",   showCancelButton: false,   closeOnConfirm: false,   animation: "slide-from-top",   inputPlaceholder: "OTP (One Time Password)" }, 
				function(inputValue2){
				var number = inputValue.replace(/[^\d]/g, '').length ;
				if (inputValue === false) return false; 
				if (otp != inputValue2) {     swal.showInputError("Please Enter the correct 4 digits");     return false   }
				firebaseRef.child("users").child(usrid).update({
					usrphone:intno
				});				
				usrphone = intno;
				swal("Update Succesful", "Congratulations. You have succesully updated your mobile number", "success"); 
				loggedin = 1; $('#myanchor').click();					
				});
				});	
				$(".sweet-alert p").html('<br>Please select your country and enter your mobile number<br>&nbsp;<br><select id="countrycd" style="padding:5px;font-size:14px; font-family:\'Maven Pro\', sans-serif;"><option data-countryCode="FR" value="33">France (+33)</option><option data-countryCode="DE" value="49">Germany (+49)</option><option data-countryCode="GR" value="30">Greece (+30)</option><option data-countryCode="HU" value="36">Hungary (+36)</option><option data-countryCode="IN" value="91" selected>India (+91)</option><option data-countryCode="ID" value="62">Indonesia (+62)</option><option data-countryCode="IT" value="39">Italy (+39)</option><option data-countryCode="JP" value="81">Japan (+81)</option><option data-countryCode="MY" value="60">Malaysia (+60)</option><option data-countryCode="MX" value="52">Mexico (+52)</option><option data-countryCode="MN" value="95">Myanmar (+95)</option><option data-countryCode="NL" value="31">Netherlands (+31)</option><option data-countryCode="NZ" value="64">New Zealand (+64)</option><option data-countryCode="PE" value="51">Peru (+51)</option><option data-countryCode="PH" value="63">Philippines (+63)</option><option data-countryCode="PL" value="48">Poland (+48)</option><option data-countryCode="RO" value="40">Romania (+40)</option><option data-countryCode="SG" value="65">Singapore (+65)</option><option data-countryCode="ZA" value="27">South Africa (+27)</option><option data-countryCode="ES" value="34">Spain (+34)</option><option data-countryCode="LK" value="94">Sri Lanka (+94)</option><option data-countryCode="SE" value="46">Sweden (+46)</option><option data-countryCode="CH" value="41">Switzerland (+41)</option><option data-countryCode="TH" value="66">Thailand (+66)</option><option data-countryCode="TR" value="90">Turkey (+90)</option><option data-countryCode="GB" value="44">UK (+44)</option></select>');
			}
			else{
				befrlogin();
			}
	}
	
	function checkfirebase(email){	
		if(clicklogin==1){
			$('body').plainOverlay('show',{
			opacity:0.8,
			fillColor: '#000',
			progress: function() { return $('<div style="font-size:40px;color:#fff;font-weight:bold;text-align:center">Syncing...</div>'); }
			});
		}		
		usrnewmail = String(email).replace(/[^a-zA-Z0-9]/g, ' ');
		firebaseRef.child("users").child(usrnewmail).once("value", function(snapshot) {			
			if(snapshot.val()){
				usrname = snapshot.child("usrname").val();
				usremail=  snapshot.child("usremail").val();
				usrphone = snapshot.child("usrphone").val();
				usrid = snapshot.child("usrid").val();
				fbflag = 0; loggedin = 1;$('#myanchor').click(); $('body').plainOverlay('hide');			
			}else if(clicklogin==1){
				$('#myanchor').click(); $('body').plainOverlay('hide');				
				swal({title: "Mobile Verification", text: "",   type: "input",   showCancelButton: false,   closeOnConfirm: false,   animation: "slide-from-top",   inputPlaceholder: "Your 10-digit mobile number" }, 				
				function(inputValue){
				if((inputValue.length == 11) && (inputValue[0] == '0')){
					inputValue = inputValue.substr(1,inputValue.length);
				};
				var number = inputValue.replace(/[^\d]/g, '').length ;
				if (inputValue === false) return false; 
				if (number != 10) {swal.showInputError("Please Enter your 10 digit mobile number (without adding zero in the beginning) and select your country code");     return false   }
				var intno = String(document.getElementById("countrycd").value)+String(inputValue.replace(/[^\d]/g, ''));
				if(document.getElementById("countrycd").value == '91'){
					otpcall(intno);
				}else{
					otpintcall(intno);
				}
						
				swal({title: "Enter OTP", text: "Please enter the 4 digit OTP sent as SMS",   type: "input",   showCancelButton: false,   closeOnConfirm: false,   animation: "slide-from-top",   inputPlaceholder: "OTP (One Time Password)" }, 
				function(inputValue2){
				var number = inputValue.replace(/[^\d]/g, '').length ;
				if (inputValue === false) return false; 
				if (otp != inputValue2) {     swal.showInputError("Please Enter the correct 4 digits");     return false   }
				if(usremail=="" || usremail===undefined){ swal({   title: "Your Email!",   text: "Oops! There was a problem confirming your email",   type: "input",   showCancelButton: true,   closeOnConfirm: false,   animation: "slide-from-top",   inputPlaceholder: "Your email here" }, function(inputValuez){   if (inputValuez === false) return false;      if (inputValuez === "") {     swal.showInputError("You need to write something!");     return false   }     usrnewmail = String(inputValuez).replace(/[^a-zA-Z0-9]/g, ' '); usremail = inputValuez})};
				firebaseRef.child("users").child(usrnewmail).update({
					usrname:usrname, usremail:usremail, usrid:usrnewmail, usrphone:intno, usrfbimg:usrfbimg, usrfbid:usrfbid
				});				
				usrphone = intno;
				usrid = usrnewmail;
				var regsclbck = "New user registered on friends : "+usrname+" "+usrphone+" "+usremail;
				mailcall(regsclbck);			
				swal("Verification Succesful", "Congratulations. You are succesfully registered with BECK!", "success"); 				
				loggedin = 1;$('#myanchor').click();	
				});
				});	
				$(".sweet-alert p").html('<br>Please select your country and enter your mobile number<br>&nbsp;<br><select id="countrycd" style="padding:5px;font-size:14px;"><option data-countryCode="FR" value="33">France (+33)</option><option data-countryCode="DE" value="49">Germany (+49)</option><option data-countryCode="GR" value="30">Greece (+30)</option><option data-countryCode="HU" value="36">Hungary (+36)</option><option data-countryCode="IN" value="91" selected>India (+91)</option><option data-countryCode="ID" value="62">Indonesia (+62)</option><option data-countryCode="IT" value="39">Italy (+39)</option><option data-countryCode="JP" value="81">Japan (+81)</option><option data-countryCode="MY" value="60">Malaysia (+60)</option><option data-countryCode="MX" value="52">Mexico (+52)</option><option data-countryCode="MN" value="95">Myanmar (+95)</option><option data-countryCode="NL" value="31">Netherlands (+31)</option><option data-countryCode="NZ" value="64">New Zealand (+64)</option><option data-countryCode="PE" value="51">Peru (+51)</option><option data-countryCode="PH" value="63">Philippines (+63)</option><option data-countryCode="PL" value="48">Poland (+48)</option><option data-countryCode="RO" value="40">Romania (+40)</option><option data-countryCode="SG" value="65">Singapore (+65)</option><option data-countryCode="ZA" value="27">South Africa (+27)</option><option data-countryCode="ES" value="34">Spain (+34)</option><option data-countryCode="LK" value="94">Sri Lanka (+94)</option><option data-countryCode="SE" value="46">Sweden (+46)</option><option data-countryCode="CH" value="41">Switzerland (+41)</option><option data-countryCode="TH" value="66">Thailand (+66)</option><option data-countryCode="TR" value="90">Turkey (+90)</option><option data-countryCode="GB" value="44">UK (+44)</option></select>');
			}else{
				acceptsloaded=1;
			}; 			
		});
	}
	
	function otpintcall(number){
	otp = Math.floor((Math.random() * 900) + 1000);	
	$.ajax({
      url: 'https://www.beckme.in/otpint.php',
      data:
      {
        phoneNumber : number,
        randomNumber : otp + ' is your OTP (One Time Password) for Beck. Please use the password to complete your Registration.'
      },
      error: function(error) {
     // console.log(JSON.stringify(error));
        },
      success: function(data) {
       //console.log(JSON.stringify(data));
       },
      type: 'POST'
	});
	}
		
	function otpcall(number){
	otp = Math.floor((Math.random() * 900) + 1000);
	$.ajax({
      url: 'https://www.beckme.in/otp.php',
      data:
      {
        phoneNumber : number,
        randomNumber : otp + ' is your OTP (One Time Password) for Beck. Please use the password to complete your Registration.'
      },
      error: function(error) {
      //console.log(JSON.stringify(error));
        },
      success: function(data) {
       //console.log(JSON.stringify(data));
       },
      type: 'POST'
	});
	}
	
	function accept(){	
	clicklogin=1;
	if(loggedin==1){
		myNavigator.pushPage('accept.html', { animation : 'none' } );
		var interval = setInterval(function(){
		if(typeof usrphone === 'undefined'){}
		else{
		clearInterval(interval);
		smsacceptdm(arrPckgs[rsltshow].usrphn);
		smsacceptsupp(usrphone);
		var actionz = "BECK friend "+ usrname +" accepted a new order: " + arrPckgs[rsltshow].id;
		mailcall(actionz,usremail,usrphone);	
		setTimeout(function(){
		myNavigator.popPage('accept.html', { animation : 'none' } );
		myNavigator.popPage('page4.html', { animation : 'none' } );
		google.maps.event.trigger(map, 'resize');
		swal("Succesfully Accepted", "The details of the request you accepted has been sent you through SMS", "success")
		},1500)
		};		
		},2000);		
		}
		else{
			fbflag = 1;
			befrlogin();
		}			
	}
	function befrlogin2(){
		$("#pseudologin").click();
		swal({ title: "Love to have you on board",   text: "Enter into your BECK Friends Account with Facebook",   type: "success",   showCancelButton: true,   confirmButtonColor: "#2bb1de",   confirmButtonText: "Go Ahead" }, function(){login()});		
	}
	
	function befrlogin(){
		$("button[data-role='end']").click();
		swal({ title: "Love to have you on board",   text: "Enter into your BECK Friends Account with Facebook",   type: "success",   showCancelButton: true,   confirmButtonColor: "#2bb1de",   confirmButtonText: "Go Ahead" }, function(){login()});		
	}
	
  function smsacceptdm(number){
	if(String(number).substring(0, 2) == '91'){
					//otpcall(inputValue);
	  $.ajax({
      url: 'https://www.beckme.in/otp.php',
      data:
      {
        phoneNumber : number,
        randomNumber : 'Your request has been accepted by your BECK friend '+String(usrname).split(" ")[0].substring(0, 30)+'. You can approve his request from your profile at www.beckme.com/friends'
      },
      error: function(error) {
      //console.log(JSON.stringify(error));
        },
      success: function(data) {
        //console.log("01"+JSON.stringify(data));
       },
      type: 'POST'
	});
	}else{
	$.ajax({
      url: 'https://www.beckme.in/otpint.php',
      data:
      {
        phoneNumber : number,
        randomNumber : 'Your request has been accepted by your BECK friend '+String(usrname).split(" ")[0].substring(0, 30)+'. You can approve his request from your profile at www.beckme.com/friends'
      },
      error: function(error) {
      //console.log(JSON.stringify(error));
        },
      success: function(data) {
       //console.log("02"+JSON.stringify(data));
       },
      type: 'POST'
	});
	}
	}
	
	function smsacceptsupp(number){	
	if(String(number).substring(0, 2) == '91'){
	$.ajax({
      url: 'https://www.beckme.in/otp.php',
      data:
      {
        phoneNumber : number,
        randomNumber : 'Thanks for accepting the request of your BECK friend '+String(arrPckgs[rsltshow].usrname).split(" ")[0].substring(0, 10)+'. We will notify you once it has been approved. You can check the status from your profile.'
      },
      error: function(error) {
      //console.log(JSON.stringify(error));
        },
      success: function(data) {
       //console.log("11"+JSON.stringify(data));
       },
      type: 'POST'
	});
	}else{
	$.ajax({
      url: 'https://www.beckme.in/otpint.php',
      data:
      {
        phoneNumber : number,
        randomNumber : 'Thanks for accepting the request of your BECK friend '+arrPckgs[rsltshow].split(" ")[0].usrname+'. We will notify you once it has been approved. You can check the status from your profile.'
      },
      error: function(error) {
      //console.log(JSON.stringify(error));
        },
      success: function(data) {
       //console.log("12"+JSON.stringify(data));
       },
      type: 'POST'
	});
	}
	}	

	function post(){	
		myNavigator.pushPage('request.html', { animation : 'none' } );
		var orderid = makeid();
		deliverydate = reformatDate(deliverydate);
		deliverytime = tConvert(deliverytime);	
		if(document.getElementById("descriptor").value != ""){
			description = document.getElementById("descriptor").value;
		}
		
		firebaseRef.child("packages").child(orderid).update({order:{img64:img64,description:description,id:orderid,lat:pickuplat,lon:pickuplng,usrid:usrid,usrphone:usrphone,usrname:usrname,usremail:usremail,pickuplat:pickuplat,pickuplng:pickuplng, delvlat:delvlat, delvlng:delvlng, pickuparea:pickuparea, pickupaddr:pickupaddr, pickupname:pickupname, pickupnum:pickupnum, deliveryaddr:deliveryaddr, deliveryarea:deliveryarea, deliverynum:deliverynum, deliveryname:deliveryname,deliverydate:deliverydate,deliverytime:deliverytime, pckgvalue:pckgvalue, pckgweight:pckgweight,pckgsize:pckgsize,fare:fare}},function(error){
		if (error) {
			myNavigator.popPage('request.html', { animation : 'none' } );
			swal({   title: "POST FAILED",   text: "Oops! Failed to post. Please try again",   type: "error",   confirmButtonText: "OK" });
		} else {
			var actionz = "BECK friend "+ usrname +" requested a new order: " + orderid;
			mailcall(actionz,usremail,usrphone);			
		}
		});
		var orderid2 = orderid+"D";
		firebaseRef.child("packages").child(orderid).update({img:{img64:img64}}).then(function() {
		firebaseRef.child("users").child(usrid).child("posts").child(orderid).update({status:"Waiting for Accept",img64:img64,description:description,id:orderid,lat:pickuplat,lon:pickuplng,usrid:usrid,usrphone:usrphone,usrname:usrname,usremail:usremail,pickuplat:pickuplat,pickuplng:pickuplng, delvlat:delvlat, delvlng:delvlng, pickuparea:pickuparea, pickupaddr:pickupaddr, pickupname:pickupname, pickupnum:pickupnum, deliveryaddr:deliveryaddr, deliveryarea:deliveryarea, deliverynum:deliverynum, deliveryname:deliveryname,deliverydate:deliverydate,deliverytime:deliverytime, pckgvalue:pckgvalue, pckgweight:pckgweight,pckgsize:pckgsize,fare:fare});
		firebaseRef.child("users").child(usrid).child("posts").update({notification:"yes"});
		geoFire.set(orderid, [pickuplat, pickuplng]).then(function() {}, function(error) {
		myNavigator.popPage('request.html', { animation : 'none' } );
		swal({   title: "POST FAILED",   text: "Oops! Failed to post. Please try again",   type: "error",   confirmButtonText: "OK" });
		});
		myNavigator.popPage('request.html', { animation : 'none' } );
		myNavigator.popPage('page2.html', { animation : 'none' } );
		myNavigator.popPage('page1.html', { animation : 'none' } );
		setTimeout(function(){
		google.maps.event.trigger(map, 'resize');
		swal("Succesfully Posted", "Your Request is posted at the pickup location. We shall update you soon!", "success");
		rfrshresults(map.getCenter());
		},1000)
		}, function(error) {
		myNavigator.popPage('request.html', { animation : 'none' } );
		swal({   title: "POST FAILED",   text: "Oops! Failed to post. Please try again",   type: "error",   confirmButtonText: "OK" });
		});		
	}
	
	var today;
	function showdatetym(){
		if(pckgsize==""){
			swal({   title: "PACKAGE SIZE",   text: "Please mention the SIZE of your package",   type: "error",   confirmButtonText: "OK" });
		}
		else if(img==""){
			swal({   title: "PACKAGE IMAGE",   text: "Please add an IMAGE of your package",   type: "error",   confirmButtonText: "OK" });
		}
		else{
		today = new Date().toISOString().slice(0, 10);
		document.getElementById("pickupdetails").style.display="none";
		document.getElementById("deliverydetails").style.display="none";
		document.getElementById("packagedetails").style.display="none";
		document.getElementById("timedetails").style.display="block";
		document.getElementById("timebtn").style.background="#00b100";		
		document.getElementById("pickupbtn").style.background="#252525";
		document.getElementById("deliverybtn").style.background="#252525";
		document.getElementById('myDate').valueAsDate = new Date();
		document.getElementById("myDate").min = document.getElementById("myDate").value;
		}
		
	}
	
	function addnewrqst(){		
		myNavigator.pushPage('page1.html', { animation : 'push' } );
		setTimeout(function(){img = ""; pckgsize=""},1000);
	}
	
	function showpickup(){
		
		if(document.getElementById('myDate').value=="" || document.getElementById('myTime').value==""){
			swal({   title: "Date & Time",   text: "Please fill a date and time for the delivery of your package",   type: "error",   confirmButtonText: "OK" });
		}else if(today >= document.getElementById('myDate').value){
			swal({   title: "Future Date",   text: "You need to select a date in the future from today for delivery",   type: "error",   confirmButtonText: "OK" });
		}
		else if((isValidDate(document.getElementById('myDate').value)) == false){swal({   title: "Invalid Date",   text: "Please select an appropriate date type for delivery",   type: "error",   confirmButtonText: "OK" });}
		else{
		document.getElementById("packagedetails").style.display="none";		
		document.getElementById("pickupbtn").style.background="#00b100";
		document.getElementById("timebtn").style.background="#00b100";
		document.getElementById("pickupdetails").style.display="block";
		document.getElementById("deliverydetails").style.display="none";
		document.getElementById("deliverybtn").style.background="#252525";	
		document.getElementById("timedetails").style.display="none";
		}						
	}
	
	function showpckg(){		
		document.getElementById("pickupbtn").style.background="#252525";
		document.getElementById("timebtn").style.background="#252525";
		document.getElementById("packagedetails").style.display="block";
		document.getElementById("pickupdetails").style.display="none";
		document.getElementById("deliverydetails").style.display="none";
		document.getElementById("deliverybtn").style.background="#252525";	
		document.getElementById("timedetails").style.display="none";				
	}
	
	function imageToDataUri(img) {
	var canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d'); var wydt = 200 * img.width / img.height;
	canvas.width = wydt; canvas.height = 200;
    ctx.drawImage(img, 0, 0, wydt, 200);
    return canvas.toDataURL('image/jpeg', 0.7);
	}
	
	var reader;
	function card(){	
	document.getElementById("files").onchange = function () {
    reader = new FileReader();
    reader.onload = function (e) {
	img = "url('"+e.target.result+"')"; var imgbckz = new Image; imgbckz.src = String(event.target.result);resizeImage(imgbckz);  
	};
    reader.readAsDataURL(this.files[0]);
	}	
	}
	
	function lala(){
	$(window).scrollTop($(window).scrollTop()+1);
	setTimeout(function(){	
		$("#pickupname").focus();			
	},500);
	
	document.getElementById('pickupname').addEventListener('keypress', function(event) {
		 if (event.keyCode == 13) {
			  $(window).scrollTop($(window).scrollTop()+1);
       
            $("#pickupaddr").focus();
        }
    });
	document.getElementById('pickupaddr').addEventListener('keypress', function(event) {
		 if (event.keyCode == 13) {
			  $(window).scrollTop($(window).scrollTop()+1);
       
            $("#pickupnum").focus();
        }
    });
	document.getElementById('pickupnum').addEventListener('keypress', function(event) {
		 if (event.keyCode == 13) {
			  $(window).scrollTop($(window).scrollTop()+1);
       
            showdelivery()
        }
    });
	}

	function lala2(){
	setTimeout(function(){
		$("#deliveryname").focus();
	},500);	
	document.getElementById('deliveryname').addEventListener('keypress', function(event) {
		 if (event.keyCode == 13) {
			$(window).scrollTop($(window).scrollTop()+1); $("#deliveryaddr").focus();
        }
    });
	document.getElementById('deliveryaddr').addEventListener('keypress', function(event) {
		 if (event.keyCode == 13) {
			$(window).scrollTop($(window).scrollTop()+1); $("#deliverynum").focus();
        }
    });
	document.getElementById('deliverynum').addEventListener('keypress', function(event) {
		 if (event.keyCode == 13) {
			receipt();
        }
    })
	}

	
	function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
	}

	var passwd;
	function signupmail(){
		if(document.getElementById("signup-email").value==""||document.getElementById("signup-username").value==""||document.getElementById("signup-password").value==""){
			swal({   title: "Insufficient Details",   text: "Oops! Please fill all details for Signing Up",   type: "error",   confirmButtonText: "OK" });
			return;
		}
		usremail = document.getElementById("signup-email").value;
		if(!validateEmail(usremail)){
			swal({   title: "Incorrect Email",   text: "Oops! Please enter a valid E-mail address & try again",   type: "error",   confirmButtonText: "OK" });
			usremail="";
			return
		};		
		$('body').plainOverlay('show',{
			opacity:0.8,
			fillColor: '#000',
			progress: function() { return $('<div style="font-size:40px;color:#fff;font-weight:bold">Working...</div>'); }
		});
		usrname = document.getElementById("signup-username").value;
		passwd = document.getElementById("signup-password").value;
		usrnewmail = String(usremail).replace(/[^a-zA-Z0-9]/g, ' ');
		firebaseRef.child("users").child(usrnewmail).once("value", function(snapshot) {
			if(snapshot.val()){
				$('body').plainOverlay('hide');	
				swal({   title: "Email already in use",   text: "Hey! You are already registered with us. Please Login",   timer: 2000,   showConfirmButton: false });		
				$('#signinbtnn').click();		
			}else{
				mailconfirm(usremail);
				$('body').plainOverlay('hide');
				swal({title: "E-mail verification Code", text: "Please enter the 4 digit Verification Code sent to your E-mail",   type: "input",   showCancelButton: false,   closeOnConfirm: false,   animation: "slide-from-top",   inputPlaceholder: "Verification Code" }, 
				function(emailVal){
				if (emailVal === false) return false;
				if (emailVal != otpmail) {     swal.showInputError("Please Enter the correct 4 digits");     return false   }
				swal("Mail Verification Succesful", "Congratulations. Just one more step to verify your Mobile Number", "success");
				swal({title: "Mobile Verification", text: "",   type: "input",   showCancelButton: false,   closeOnConfirm: false,   animation: "slide-from-top",   inputPlaceholder: "Your 10-digit mobile number" }, 				
				function(inputValue){
				if((inputValue.length == 11) && (inputValue[0] == '0')){
					inputValue = inputValue.substr(1,inputValue.length);
				};
				var number = inputValue.replace(/[^\d]/g, '').length ;
				if (inputValue === false) return false; 
				if (number != 10) {swal.showInputError("Please Enter your 10 digit mobile number (without adding zero in the beginning) and select your country code");     return false   }
				var intno = String(document.getElementById("countrycd").value)+String(inputValue.replace(/[^\d]/g, ''));
				if(document.getElementById("countrycd").value == '91'){
					otpcall(intno);
				}else{
					otpintcall(intno);
				}						
				swal({title: "Enter OTP", text: "Please enter the 4 digit OTP sent as SMS",   type: "input",   showCancelButton: false,   closeOnConfirm: false,   animation: "slide-from-top",   inputPlaceholder: "OTP (One Time Password)" }, 
				function(inputValue2){
				var number = inputValue.replace(/[^\d]/g, '').length ;
				if (inputValue === false) return false; 
				if (otp != inputValue2) {     swal.showInputError("Please Enter the correct 4 digits");     return false   }
				if(usremail=="" || usremail===undefined){ swal({   title: "Your Email!",   text: "Oops! There was a problem confirming your email",   type: "input",   showCancelButton: true,   closeOnConfirm: false,   animation: "slide-from-top",   inputPlaceholder: "Your email here" }, function(inputValuez){   if (inputValuez === false) return false;      if (inputValuez === "") {     swal.showInputError("You need to write something!");     return false   }     usrnewmail = String(inputValuez).replace(/[^a-zA-Z0-9]/g, ' '); usremail = inputValuez})};
				firebaseRef.createUser({ email : usremail,  password : passwd}, function(error, userData) {
					localStorage.setItem('svemail' , usremail);
					localStorage.setItem('svpsw' , passwd);
					if (error) {
						sweetAlert("Oops...", "There was a problem creating your Account. Please try Again", "error");
						$('#myanchor').click();
						$('body').plainOverlay('hide');
						return;
					} else {
						firebaseRef.child("users").child(usrnewmail).update({usrname:usrname, usremail:usremail, usrid:usrnewmail, usrphone:intno});	
						usrphone = intno; usrid = usrnewmail; var regsclbck = "New user registered on friends : "+usrname+" "+usrphone+" "+usremail;
						mailcall(regsclbck); $('body').plainOverlay('hide'); swal("Verification Succesful", "Congratulations. You are succesfully registered with BECK!", "success"); loggedin = 1;	$('#myanchor').click();	
				document.getElementById("namehdr").innerHTML += 'Hi ' + usrname.split(" ")[0].substring(0, 10);		 
				document.getElementById("namehdr").style.display = "inline-block";
				document.getElementById("signleft").style.display = "none";
				fbflag = 0; loggedin = 1; $('#myanchor').click();	
				$('#myanchor').click();						
					};
				})			
				})
				});	
				$(".sweet-alert p").html('<br>Please select your country and enter your mobile number<br>&nbsp;<br><select id="countrycd" style="padding:5px;font-size:14px;"><option data-countryCode="FR" value="33">France (+33)</option><option data-countryCode="DE" value="49">Germany (+49)</option><option data-countryCode="GR" value="30">Greece (+30)</option><option data-countryCode="HU" value="36">Hungary (+36)</option><option data-countryCode="IN" value="91" selected>India (+91)</option><option data-countryCode="ID" value="62">Indonesia (+62)</option><option data-countryCode="IT" value="39">Italy (+39)</option><option data-countryCode="JP" value="81">Japan (+81)</option><option data-countryCode="MY" value="60">Malaysia (+60)</option><option data-countryCode="MX" value="52">Mexico (+52)</option><option data-countryCode="MN" value="95">Myanmar (+95)</option><option data-countryCode="NL" value="31">Netherlands (+31)</option><option data-countryCode="NZ" value="64">New Zealand (+64)</option><option data-countryCode="PE" value="51">Peru (+51)</option><option data-countryCode="PH" value="63">Philippines (+63)</option><option data-countryCode="PL" value="48">Poland (+48)</option><option data-countryCode="RO" value="40">Romania (+40)</option><option data-countryCode="SG" value="65">Singapore (+65)</option><option data-countryCode="ZA" value="27">South Africa (+27)</option><option data-countryCode="ES" value="34">Spain (+34)</option><option data-countryCode="LK" value="94">Sri Lanka (+94)</option><option data-countryCode="SE" value="46">Sweden (+46)</option><option data-countryCode="CH" value="41">Switzerland (+41)</option><option data-countryCode="TH" value="66">Thailand (+66)</option><option data-countryCode="TR" value="90">Turkey (+90)</option><option data-countryCode="GB" value="44">UK (+44)</option></select>');
				});
			}; 			
		});
	}
	
	function loginmail(){
		if(document.getElementById("signin-email").value==""||document.getElementById("signin-password").value==""){
			swal({   title: "Insufficient Details",   text: "Oops! Please fill all details for Signing In",   type: "error",   confirmButtonText: "OK" });
			return;
		}	
		$('body').plainOverlay('show',{opacity:0.8, fillColor: '#000', progress: function() { return $('<div style="font-size:40px;color:#fff;font-weight:bold">Logging you in...</div>') }});
		usremail = document.getElementById("signin-email").value;
		passwd = document.getElementById("signin-password").value;
		usrnewmail = String(usremail).replace(/[^a-zA-Z0-9]/g, ' ');
		firebaseRef.authWithPassword({email:usremail, password : passwd}, function(error, authData) {
  if (error) {
    $('body').plainOverlay('hide');
	sweetAlert("Incorrect credentials", "Please try with correct E-mail & password. If you are a new user, please Sign Up", "error");
	return;
  } else {
    firebaseRef.child("users").child(usrnewmail).once("value", function(snapshot) {
		$('body').plainOverlay('hide');
		if(snapshot.val()){				
				usrname = snapshot.child("usrname").val();
				usremail=  snapshot.child("usremail").val();
				usrphone = snapshot.child("usrphone").val();
				usrid = snapshot.child("usrid").val();
				localStorage.setItem('svemail' , usremail);
				localStorage.setItem('svpsw' , passwd);
				document.getElementById("namehdr").innerHTML += 'Hi ' + usrname.split(" ")[0].substring(0, 10);		 
				document.getElementById("namehdr").style.display = "inline-block";
				document.getElementById("signleft").style.display = "none";
				fbflag = 0; loggedin = 1;	
				$('#myanchor').click();			
			}else{
				sweetAlert("Oops...", "Our servers could not recognise you. Please try Again", "error");
						
			}
	});
	}
	});
	}
	
	function resetpswd(){
		if(document.getElementById("signin-email").value=="" || !validateEmail(document.getElementById("signin-email").value)){
			swal({   title: "Insufficient Details",   text: "Oops! Please Enter the Email-id and password that you think was correct",   type: "error",   confirmButtonText: "OK" });
			return;
		}
	firebaseRef.resetPassword({
  email : document.getElementById("signin-email").value
}, function(error) {
  if (error === null) {
	 $('#myanchor').click();	
	 sweetAlert("Good Job!", "The password reset E-mail has been sent to you. Please check your Inbox", "success");
  } else {
     sweetAlert("Oops...", "Our servers could not recognise you. Please try Again", "error");
  }
	})
	}
	
	
	