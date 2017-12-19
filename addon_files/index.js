document.addEventListener('DOMContentLoaded', function() {

	var signup_btn = document.getElementById('signup_btn');
	signup_btn.addEventListener('click', show_signup_page);

	var login_btn = document.getElementById('login_btn');
	login_btn.addEventListener('click', show_login_page);

	var submit_signup_btn = document.getElementById('submit_signup_btn');
	submit_signup_btn.addEventListener('click', perform_signup);

	var submit_login_btn = document.getElementById('submit_login_btn');
	submit_login_btn.addEventListener('click', perform_login);

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

function show_signup_page(){
	document.getElementById("homepage").style.display = "none";
	document.getElementById("login_page").style.display = "none";
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
	document.getElementById("login_page").style.display = "block";

	hide_error_message();
	hide_success_message();

	document.getElementById("email").addEventListener('keypress', hide_error_message);
	document.getElementById("password").addEventListener('keypress', hide_error_message);
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

	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
		if (xhr.readyState == 4) {
			if(xhr.status == 200){
				var json_response = JSON.parse(xhr.responseText);
				if(json_response.status == "OK"){
					display_success_message("Successful Login!");
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