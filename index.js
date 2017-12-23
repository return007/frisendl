var EMAIL, PASSWORD, ID;

document.addEventListener('DOMContentLoaded', function() {

	var signup_btn = document.getElementById('signup_btn');
	signup_btn.addEventListener('click', show_signup_page);

	var login_btn = document.getElementById('login_btn');
	login_btn.addEventListener('click', show_login_page);

	var submit_signup_btn = document.getElementById('submit_signup_btn');
	submit_signup_btn.addEventListener('click', perform_signup);

	var submit_login_btn = document.getElementById('submit_login_btn');
	submit_login_btn.addEventListener('click', perform_login);

	var friend_section_btn = document.getElementById('friend_section_btn');
	friend_section_btn.addEventListener('click', show_friend_section);

	var upload_section_btn = document.getElementById('upload_section_btn');
	upload_section_btn.addEventListener('click', show_upload_section);

	var logout_btn = document.getElementById('logout_btn');
	logout_btn.addEventListener('click', perform_logout);

	var go_btn = document.getElementById('go_btn');
	go_btn.addEventListener('click', show_search_result);

});

function display_error_message(msg){
	document.getElementById("error").innerHTML = msg;
	hide_success_message();
}
function hide_error_message(){
	document.getElementById("error").innerHTML = "&nbsp;";
}
function display_success_message(msg){
	document.getElementById("success").innerHTML = msg;
	hide_error_message();
}
function hide_success_message(){
	document.getElementById("success").innerHTML = "&nbsp;";
}

function show_home_page(){
	document.getElementById("homepage").style.display = "block";
	document.getElementById("login_page").style.display = "none";
	document.getElementById("main_page").style.display = "none";	
	document.getElementById("signup_page").style.display = "none";
}

function show_signup_page(){
	document.getElementById("homepage").style.display = "none";
	document.getElementById("login_page").style.display = "none";
	document.getElementById("main_page").style.display = "none";	
	document.getElementById("signup_page").style.display = "block";

	hide_error_message();
	hide_success_message();

	document.getElementById("username").addEventListener('keypress', hide_error_message);
	document.getElementById("email").addEventListener('keypress', hide_error_message);
	document.getElementById("password").addEventListener('keypress', hide_error_message);
	document.getElementById("confirm_password").addEventListener('keypress', hide_error_message);
}

function show_login_page(){
	document.getElementById("homepage").style.display = "none";
	document.getElementById("signup_page").style.display = "none";
	document.getElementById("main_page").style.display = "none";	
	document.getElementById("login_page").style.display = "block";

	hide_error_message();
	hide_success_message();

	document.getElementById("email").addEventListener('keypress', hide_error_message);
	document.getElementById("password").addEventListener('keypress', hide_error_message);
}

function show_main_page(){
	document.getElementById("homepage").style.display = "none";
	document.getElementById("signup_page").style.display = "none";
	document.getElementById("login_page").style.display = "none";
	document.getElementById("main_page").style.display = "block";

	hide_error_message();
	hide_success_message();

	show_friend_section();
}

function show_friend_section(){
	document.getElementById("friend_section").style.display = "block";
	document.getElementById("upload_section").style.display = "none";

	hide_error_message();
	hide_success_message();

	show_friend_list();
}

function show_upload_section(){
	document.getElementById("upload_section").style.display = "block";
	document.getElementById("friend_section").style.display = "none";	
}

function perform_logout(){
	// Erase credentials from storage, unset ID, EMAIL, PASSWORD variables, show homepage :P
	var removing_credentials = browser.storage.local.remove('credentials');
	removing_credentials.then(() => {
		ID = EMAIL = PASSWORD = null;
		show_home_page();
	}, display_error_message);
}

function show_friend_list(){
	var request_body = {
		"id": ID
	};

	document.getElementById("friend_list_header").innerHTML = "Friends";

	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
		if (xhr.readyState == 4) {
			if(xhr.status == 200){
				var json_response = JSON.parse(xhr.responseText);
				if(json_response.status == "OK"){

					var friend_list = json_response.response;
					var div_friend_list = "";
					if(friend_list.length == 0){
						display_error_message("No friends to show!");
						return;
					}

					for(var itr=0; itr < friend_list.length; itr++){
						div_friend_list += "<div id=\""+friend_list[itr].id+"\" class=\"friend\" > \
												<div id=\"friend_username\">"+friend_list[itr].username+"</div>\
												<div id=\"friend_email\">"+friend_list[itr].email+"</div>  \
											</div>";

					}
					document.getElementById("friend_list").innerHTML = div_friend_list;
				}
				else{
					display_error_message(json_response.response);
				}
			}
			else
				display_error_message("Unsuccessful HTTP Request!");
		}
	};

	xhr.open("POST", "http://localhost/cgi-bin/friend_list.py", true);
	xhr.setRequestHeader("Accept", "application/json");
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.send(JSON.stringify(request_body));	

}

function show_search_result(){
	var search_query = document.getElementById("search_query").value;
	if(is_empty(search_query)){
		return;
	}

	hide_error_message();
	hide_success_message();

	var friend_list = document.getElementsByClassName("friend");
	for(var itr=0; itr < friend_list.length; itr++){
		friend_list[itr].style.display = "none";
	}
	document.getElementById("friend_list_header").innerHTML = "Search Results";

	//Make search_element class based divs to display inside the friend_list div
	//search_element class div will have Name, Email ID (hidden characters too), FriendRequest Option (if not a friend)

	var request_body = {
		"id": ID,
		"password": PASSWORD,
		"q": search_query
	};

	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
		if (xhr.readyState == 4) {
			if(xhr.status == 200){
				var json_response = JSON.parse(xhr.responseText);
				if(json_response.status == "OK"){
					var search_list = json_response.response;
					var div_search_list="";

					if(search_list.length == 0){
						display_error_message("No search results!");
						return;
					}

					for(var itr=0; itr < search_list.length; itr++){
						div_search_list += "<div id=\""+search_list[itr].id+"\" class=\"friend\" > \
												<div id=\"friend_username\">"+search_list[itr].username+"</div>\
												<div id=\"friend_email\">"+search_list[itr].email+"</div>  \
												<div id=\"friend_request_btn_"+search_list[itr].id+"\" class=\"friend_request_btn\">Send Request!</div>\
											</div>";

					}
					document.getElementById("friend_list").innerHTML = div_search_list;
					for(var itr=0; itr < search_list.length; itr++){
						document.getElementById("friend_request_btn_"+search_list[itr].id).addEventListener('click', send_friend_request);
					}
				}
				else{
					display_error_message(json_response.response);
				}
			}
			else
				display_error_message("Unsuccessful HTTP Request!");
		}
	};
	xhr.open("POST", "http://localhost/cgi-bin/search_friend.py", true);
	xhr.setRequestHeader("Accept", "application/json");
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.send(JSON.stringify(request_body));	

}

function send_friend_request(){

	if(this.innerHTML != "Send Request!"){
		return;
	}

	var friend_id = this.id;
	friend_id = friend_id.substring(friend_id.lastIndexOf("_")+1);

	// session parameters will also be sent ofc :P
	var request_body = {
		"id": ID,
		"password": PASSWORD,
		"friend_id": friend_id
	};

	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
		if (xhr.readyState == 4) {
			if(xhr.status == 200){
				var json_response = JSON.parse(xhr.responseText);
				if(json_response.status == "OK"){
					// display friend added instead of the button of send request!
					document.getElementById("friend_request_btn_"+friend_id).innerHTML = "Friend Added!";
				}
				else{
					display_error_message(json_response.response);
				}
			}
			else
				display_error_message("Unsuccessful HTTP Request!");
		}
	};
	xhr.open("POST", "http://localhost/cgi-bin/friend_request.py", true);
	xhr.setRequestHeader("Accept", "application/json");
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.send(JSON.stringify(request_body));
}

function is_empty(val){
	if(val.length == 0 || val.trim().length == 0){
		return true;
	}
	return false;
}

function perform_signup(){
	var signup = document.getElementById("signup_page").children;
	var username = signup[0].value;
	var email = signup[2].value;
	var password = signup[4].value;
	var confirm_password = signup[6].value;

	if(is_empty(username)){
		display_error_message("Username cannot be empty!");
		return;
	}
	if(is_empty(email)){
		display_error_message("Email cannot be empty!");
		return;
	}
	if(is_empty(password)){
		display_error_message("Password cannot be empty!");
		return;
	}
	if(is_empty(confirm_password)){
		display_error_message("Confirm password cannot be empty!");
		return;
	}
	if(username.length < 5){
		display_error_message("Username should be atleast 5 characters!");
		return;
	}
	if(password != confirm_password){
		display_error_message("Password and Confirm password did not match!");
		return;
	}

	var request_body = {
		'username': username,
		'email': email,
		'password': password
	};

	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
		if (xhr.readyState == 4) {
			if(xhr.status == 200){
				var json_response = JSON.parse(xhr.responseText);
				if(json_response.status == "OK"){
					display_success_message("Successfully registered! Login to continue.");
					setTimeout(show_login_page, 1000);
				}
				else{
					display_error_message(json_response.response);
				}
			}
			else
				display_error_message("Unsuccessful HTTP Request!");
		}
	};
	xhr.open("POST", "http://localhost/cgi-bin/signup.py", true);
	xhr.setRequestHeader("Accept", "application/json");
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.send(JSON.stringify(request_body));

}

function perform_login(){

	var login = document.getElementById("login_page").children;
	var email = login[0].value;
	var password = login[2].value;

	if(is_empty(email)){
		display_error_message("Email cannot be empty!");
		return;
	}
	if(is_empty(password)){
		display_error_message("Password cannot be empty!");
		return;
	}
	var request_body = {
		'email': email,
		'password': password
	};

	EMAIL = email;
	PASSWORD = password;

	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
		if (xhr.readyState == 4) {
			if(xhr.status == 200){
				var json_response = JSON.parse(xhr.responseText);
				if(json_response.status == "OK"){
					display_success_message("Successful Login!");
					ID = json_response.response;

					var credentials = {
						email: EMAIL,
						password: PASSWORD,
						id: ID
					};
					var setting_credentials = browser.storage.local.set({credentials: credentials});
					setting_credentials.then(null, display_error_message);

					setTimeout(show_main_page, 1000);
				}
				else{
					display_error_message(json_response.response);
				}
			}
			else
				display_error_message("Unsuccessful HTTP Request!");
		}
	};
	xhr.open("POST", "http://localhost/cgi-bin/login.py", true);
	xhr.setRequestHeader("Accept", "application/json");
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.send(JSON.stringify(request_body));
}

init();

function init(){
	// check if there has been a previous login, if yes obtain credentials from storage and automatically perform login
	// if now, leave it as it as

	var getting_credentials = browser.storage.local.get('credentials');
	getting_credentials.then((result) => {

		var credentials = result.credentials;
		var id = credentials.id;
		var password = credentials.password;
		var email = credentials.email;

		if(id != null && password != null && email != null){
			// attempt to login and check if the ids match :P
			// if all is done, display main_page

			ID = id;
			EMAIL = email;
			PASSWORD = password;
			show_main_page();
		}
	}, display_error_message);
}