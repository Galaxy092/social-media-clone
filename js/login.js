'use strict';

$(document).ready(function () {
  // Function to get URL parameters
  function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null
      ? ''
      : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  // Check for the login parameter in the URL
  var loginStatus = getUrlParameter('login');

  // Check if the toast has already been shown
  var toastShown = sessionStorage.getItem('toastShown');

  // Display a toast message if login was successful
  if (loginStatus === 'success' && !toastShown) {
    toastr.success('Login successful! Welcome.', 'Success', {
      closeButton: true, // Display close button
      timeOut: 5000, // Close the toast after 5 seconds (adjust as needed)
      extendedTimeOut: 1000, // Increase the extended time for the close button
    });

    // Set a flag in sessionStorage to indicate that the toast has been shown
    sessionStorage.setItem('toastShown', 'true');
  }

  const passwordInput = $('#password');
  const togglePasswordButton = $('#togglePassword');

  togglePasswordButton.on('click', function () {
    const type =
      passwordInput.attr('type') === 'password' ? 'text' : 'password';
    passwordInput.attr('type', type);

    // Change the label text based on the password visibility
    const iconClass = type === 'password' ? 'fa-eye' : 'fa-eye-slash';
    togglePasswordButton.html(`<i class="fas ${iconClass} pr-4 text-gray-600"></i>`);
  });
});

// Bind the keypress event to the document
$(document).keypress(function (e) {
  // Check if the pressed key is Enter (key code 13)
  if (e.which === 13) {
    // Prevent the default form submission behavior
    e.preventDefault();
    // Call the submitForm function
    submitForm();
  }
});

function submitForm() {
  // Get input values
  var username = $('#username').val();
  var password = $('#password').val();

  // Prepare data for AJAX request
  var data = {
    identifier: username,
    password: password,
  };

  // Make AJAX request to the login API
  $.ajax({
    type: 'POST',
    url: 'https://cms.istad.co/api/auth/local',
    data: JSON.stringify(data),
    contentType: 'application/json',
    success: function (response) {
      console.log(response.user);
      // Check if login was successful
      if (response) {
        // Store the token in local storage or a cookie for future requests
        localStorage.setItem('token', response.jwt);
        localStorage.setItem('id', response.user.id);
        // Redirect to the home page or perform other actions
        window.location.href = '/src/pages/home.html?login=success';
      } else {
        // Show toastr notification for login failure
      }
    },
    error: function (error) {
      console.error('Error during login:', error);
      toastr.error('Login failed. Please check your username and password.');
    },
  });
}
