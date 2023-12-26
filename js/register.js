'use strict';

function register() {
  var username = $('#username').val();
  var email = $('#email').val();
  var password = $('#password').val();
  var repeatPassword = $('#repeat-password').val();

  // Check if passwords match
  if (password !== repeatPassword) {
    toastr.error('Passwords do not match');
    return;
  }

  // Check if the password is at least 6 characters
  if (password.length < 6) {
    toastr.error('Password must be at least 6 characters');
    return;
  }

  // Make AJAX request to the registration API
  $.ajax({
    url: 'https://cms.istad.co/api/auth/local/register',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({
      username: username,
      email: email,
      password: password,
    }),
    success: function (response) {
      // Handle success response
      console.log(response);
      toastr.success('Registration successful!');

      // Redirect to login.html after a delay
      setTimeout(function () {
        window.location.href = "/src/pages/login.html";
    }, 2000); // Adjust the delay as needed
    },
    error: function (error) {
      // Handle error response
      console.error(error.responseJSON);
      toastr.error('Registration failed. Please try again.');
    },
  });
}

$(document).ready(function () {
  $('.toggle-password').on('click', function () {
      const passwordInput = $(this).prev('.password-input');
      const type = passwordInput.attr('type') === 'password' ? 'text' : 'password';
      passwordInput.attr('type', type);

      // Change the button text based on the password visibility
      const buttonText = type === 'password' ? 'Show' : 'Hide';
      $(this).text(buttonText);
  });
});