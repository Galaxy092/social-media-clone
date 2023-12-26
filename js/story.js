'use strict';

// Get User Bio
const responseJwt = localStorage.getItem('token');
$.ajax({
  type: 'GET',
  url: 'https://cms.istad.co/api/users/me?populate=*',
  headers: {
    Authorization: 'Bearer ' + responseJwt,
  },
  success: function (userBio) {
    // Display User Info
    // Update the DOM with the fetched data
    $('#profileImage').attr(
      'src',
      'https://cms.istad.co' + userBio.profile.url ||
        'default-profile-image.jpg'
    );
    $('#userName').text(userBio.username || 'Unknown User');
    $('#userGmail').text(userBio.email || 'No email available');
  },
  error: function (error) {
    console.error('Error fetching user bio:', error);
  },
});

function logout() {
  // Clear local storage
  localStorage.clear();
  // Clear toast sessionStorage
  sessionStorage.clear();

  window.location.href = '/src/pages/login.html';
}

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
});

// Fetch categories from the API
$.ajax({
  url: 'https://cms.istad.co/api/sm-categories',
  method: 'GET',
  dataType: 'json',
  success: function (response) {
    // Handle the response and generate buttons
    handleCategories(response);
  },
  error: function (error) {
    console.error('Error fetching categories:', error);
  },
});

function handleCategories(categories) {
  // Select the container div for buttons
  var container = $('#categoryButtons');

  // Iterate through categories and create buttons
  $.each(categories.data, function (index, category) {
    var button = $('<button>')
      .addClass(
        'text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none'
      )
      .text(category.attributes.name);

    // You can customize the button behavior here if needed

    // Append the button to the container
    container.append(button);
  });
}

// Display all story
$(document).ready(function () {
  // Fetch stories from the API
  $.ajax({
    url: 'https://cms.istad.co/api/sm-stories?populate=media,user.profile',
    method: 'GET',
    dataType: 'json',
    success: function (data) {
      // Iterate through each story in the response
      $.each(data.data, function (index, story) {
        // Append a new section for each story to the stories-container
        $('#stories-container').append(`
            <section class="flex-shrink-0 border-2 mb-10 w-full" data-index="${index}">
              <div class="relative grid h-[20rem] w-full max-w-full flex-col items-center justify-center overflow-hidden rounded-xl bg-white bg-contain bg-clip-border text-center text-gray-700">
                <div class="absolute inset-0 m-0 h-full w-full overflow-hidden rounded-none bg-transparent bg-cover bg-clip-border bg-center text-gray-700 shadow-none"
                  style="background-image: url('https://cms.istad.co${
                    story.attributes.media.data.attributes.url
                  }')">
                  <div class="absolute inset-0 w-full h-full to-bg-black-10 bg-gradient-to-t from-black/80 via-black/50"></div>
                </div>
                <div class="relative p-6 px-6 py-14 md:px-12">
                  <h5 class="block mb-4 font-sans text-sm antialiased font-semibold leading-snug tracking-normal text-gray-400">
                    ${story.attributes.user.data.attributes.username}
                  </h5>
                  ${story?.attributes?.user?.data?.attributes?.profile?.data?.attributes?.url ?
                    `<img alt="..." src="https://cms.istad.co${story?.attributes?.user?.data?.attributes?.profile?.data?.attributes?.url}" class="relative inline-block w-10 h-10 rounded-full border-2 border-white object-cover object-center story-thumbnail" />` :
                    `<img src="https://placehold.co/600x400" class="relative inline-block w-10 h-10 rounded-full border-2 border-white object-cover object-center story-thumbnail" />`}
                </div>
              </div>
            </section>
          `);
      });

      // Attach click event to each story thumbnail
      $('.story-thumbnail').click(function () {
        const index = $(this).closest('section').data('index');
        showPopup(data.data[index]);
        // Automatically close the popup after 5 seconds
        setTimeout(function () {
          $('#story-popup').hide();
        }, 5000);
      });
    },
    error: function (error) {
      console.error('Error fetching stories:', error);
    },
  });
});

// Function to show the popup with the selected story
function showPopup(story) {
  $('#popup-image-container').html(`
      <div id="story-indicator-bar" class="relative top-4 left-0 w-[29rem] mx-auto bg-gray-800 h-2 rounded-full">
        <div id="story-indicator" class="h-full bg-blue-500 rounded-full "></div>
      </div>
      <img id="imgId" class="rounded-lg mx-auto object-contain" src="https://cms.istad.co${story.attributes.media.data.attributes.url}" alt="Story Image">
    `);
  $('#popup-username').text(story.attributes.user.data.attributes.username);
  $('#story-popup').show();
  $('#stories-container').hide();

  // Simulate progress on the indicator bar
  simulateIndicatorBar();
}

// Function to close the popup
$('#close-popup').click(function () {
  $('#story-popup').hide();
  $('#stories-container').show();
});

// Function to simulate progress on the indicator bar
function simulateIndicatorBar() {
  const indicator = $('#story-indicator');
  let progress = 0;
  const interval = setInterval(function () {
    progress += 1;
    indicator.width(`${progress}%`);

    if (progress >= 100) {
      clearInterval(interval);
      $('#stories-container').show();
    }
  }, 50);
}