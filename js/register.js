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

const passwordInput = $('#password');
const togglePasswordButton = $('#togglePassword1');

togglePasswordButton.on('click', function () {
  const type =
    passwordInput.attr('type') === 'password' ? 'text' : 'password';
  passwordInput.attr('type', type);

  // Change the label text based on the password visibility
  const iconClass = type === 'password' ? 'fa-eye' : 'fa-eye-slash';
  togglePasswordButton.html(`<i class="fas ${iconClass} pr-4 text-gray-600"></i>`);
});
const passwordInput1 = $('#repeat-password');
const togglePasswordButton1 = $('#togglePassword');

togglePasswordButton1.on('click', function () {
  const type =
    passwordInput1.attr('type') === 'password' ? 'text' : 'password';
  passwordInput1.attr('type', type);

  // Change the label text based on the password visibility
  const iconClass = type === 'password' ? 'fa-eye' : 'fa-eye-slash';
  togglePasswordButton1.html(`<i class="fas ${iconClass} pr-4 text-gray-600"></i>`);
});