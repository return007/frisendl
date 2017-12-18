document.addEventListener('DOMContentLoaded', function() {

	var signup_btn = document.getElementById('signup_btn');
	signup_btn.addEventListener('click', show_signup_page);

});

function show_signup_page(){
	document.getElementById("homepage").style.display = "none";
	document.getElementById("signup_page").style.display = "block";
}