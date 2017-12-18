document.addEventListener('DOMContentLoaded', function() {

	var signup_btn = document.getElementById('signup_btn');
	signup_btn.addEventListener('click', show_signup_page);

	var login_btn = document.getElementById('login_btn');
	login_btn.addEventListener('click', show_login_page);	

});

function show_signup_page(){
	document.getElementById("homepage").style.display = "none";
	document.getElementById("login_page").style.display = "none";
	document.getElementById("signup_page").style.display = "block";
}

function show_login_page(){
	document.getElementById("homepage").style.display = "none";
	document.getElementById("signup_page").style.display = "none";
	document.getElementById("login_page").style.display = "block";
}