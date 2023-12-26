'use strict';

/// Get User Bio
const responseJwt = localStorage.getItem('token');

if (responseJwt) {
  // User is authenticated, fetch user bio
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
          'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
      );
      $('#userName').text(userBio.username || 'Unknown User');
      $('#userGmail').text(userBio.email || 'No email available');

      // Redirect to profile page when clicking on the user profile
      $('#profileLink').on('click', function () {
        window.location.href = '/src/pages/profile.html';
      });
    },
    error: function (error) {
      console.error('Error fetching user bio:', error);
    },
  });
} else {
  // User is not authenticated, render guest image
  $('#profileImage').attr(
    'src',
    'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
  );
  $('#userName').text('Guest User');
  $('#userGmail').text('No email available');

  // Redirect to login page when clicking on the guest profile
  $('#profileLink').on('click', function (event) {
    event.preventDefault(); // Prevent the default behavior of the anchor tag
    window.location.href = '/src/pages/login.html';
  });
}

document.addEventListener('DOMContentLoaded', function () {
  updateButtonBasedOnLocalStorage();

  // Check if the user has an "id" in localStorage
  const userId = localStorage.getItem('id');

  // Get the friends link element
  const friendsLink = document.getElementById('friendsLink');
  const profileLink = document.getElementById('profileLink1');
  const settingLink = document.getElementById('settingLink');

  // Update the href attribute based on the presence of "id"
  if (userId) {
    friendsLink.href = '/src/pages/friend.html';
    profileLink.href = '/src/pages/profile.html';
    settingLink.href = '/src/pages/setting.html';
  } else {
    // If no "id" is present, handle it with Toastr
    friendsLink.addEventListener('click', function (event) {
      event.preventDefault();
      toastr.warning('You need to be logged in to access Friends Page!');
      // You can redirect to a login page or perform any other action
    });
    // If no "id" is present, handle it with Toastr
    profileLink.addEventListener('click', function (event) {
      event.preventDefault();
      toastr.warning('You need to be logged in to access Profile Page!');
      // You can redirect to a login page or perform any other action
    });
    // If no "id" is present, handle it with Toastr
    settingLink.addEventListener('click', function (event) {
      event.preventDefault();
      toastr.warning('You need to be logged in to access Setting Page!');
      // You can redirect to a login page or perform any other action
    });
  }
});

function handleButtonClick() {
  // Check if the user has an ID in local storage
  if (localStorage.getItem('id')) {
    // User is logged in, perform logout
    logout();
  } else {
    // User is not logged in, perform login
    // Add your login logic here
    window.location.href = '/src/pages/login.html';
  }
}

function updateButtonBasedOnLocalStorage() {
  const logoutText = document.getElementById('logoutText');

  // Check if the user has an ID in local storage
  if (localStorage.getItem('id')) {
    // User is logged in, update button text
    logoutText.innerText = 'Logout';
  } else {
    // User is not logged in, update button text
    logoutText.innerText = 'Login';
  }
}

function logout() {
  // Implement your logout logic here
  // For example, clear user ID from local storage
  localStorage.clear();
  sessionStorage.clear();

  // Update the button text after logout
  updateButtonBasedOnLocalStorage();

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

//Follow feature
$(document).ready(function () {
  var followers = [];

  function fetchAndDisplayUserData() {
    $('#userListContainer').empty();

    var loggedInUserId = localStorage.getItem('id');

    // Check if the user is logged in
    if (!loggedInUserId) {
      $.ajax({
        url: 'https://cms.istad.co/api/users?populate=profile',
        type: 'GET',
        success: function (data) {
          $.each(data, function (index, user) {
            // Construct the profile image URL
            var profileImageUrl = user?.profile?.url
              ? `https://cms.istad.co${user.profile.url}`
              : 'https://th.bing.com/th/id/R.9e54d586089212511aa923ae02f62377?rik=yXRlJomMslCU3w&riu=http%3a%2f%2fischedule.md%2fimages%2favatar_2x.png&ehk=19LHXczqEXK4%2bzVWH94JcVc6WFf%2bBK4bzQ2Jw1beDGo%3d&risl=&pid=ImgRaw&r=0';

            // Construct the user element HTML
            var userElement = `
                <div class="flex justify-between w-full">
                  <a href="/src/pages/details.html?id=${user.id}">
                    <div class="flex gap-4">
                        <img class="h-10 w-10 rounded-full"
                            src="${profileImageUrl}"
                            alt="" />
                        <p class="text-start font-bold pt-2">${user.username}</p>
                    </div>
                  </a>
                    <button class="h-10 w-24 bg-blue-600 rounded-lg text-white follow-button" data-user-id="${user.id}">
                        Follow
                    </button>
                </div>
            `;

            // Append the user element to the userCard
            $('#userListContainer').append(userElement);

            // Break out of the loop after appending 5 users
            if ($('#userListContainer').children().length >= 5) {
              return false; // This will break out of the loop
            }
          });
          $('.follow-button').click(async function () {
            let userLoginUser = localStorage.getItem('id');
            if (!userLoginUser) {
              toastr.error('Please log in to follow users.');
            }
          });
        },
      });
      // toastr.error('Please log in to follow users.');
    } else {
      $.ajax({
        url: 'https://cms.istad.co/api/users?populate=profile',
        type: 'GET',
        success: function (data) {
          $.ajax({
            url: `https://cms.istad.co/api/users/${loggedInUserId}?populate=users`,
            type: 'GET',
            success: function (response) {
              followers = response.users.map((e) => e.id);

              for (var i = 0; i < data.length; i++) {
                var user = data[i];

                if (user.id !== loggedInUserId && !isUserFollowed(user.id)) {
                  var profileImageUrl = user?.profile?.url
                    ? `https://cms.istad.co${user.profile.url}`
                    : 'https://th.bing.com/th/id/R.9e54d586089212511aa923ae02f62377?rik=yXRlJomMslCU3w&riu=http%3a%2f%2fischedule.md%2fimages%2favatar_2x.png&ehk=19LHXczqEXK4%2bzVWH94JcVc6WFf%2bBK4bzQ2Jw1beDGo%3d&risl=&pid=ImgRaw&r=0';

                  var userElement = `
                    <div class="flex justify-between w-full">
                      <a href="/src/pages/details.html?id=${user.id}">
                        <div class="flex gap-4">
                          <img class="h-10 w-10 rounded-full"
                            src="${profileImageUrl}"
                            alt="" />
                          <p class="text-start font-bold pt-2">${user.username}</p>
                        </div>
                      </a>
                      <button class="h-10 w-24 bg-blue-600 rounded-lg text-white follow-button" data-user-id="${user.id}">
                        Follow
                      </button>
                    </div>
                  `;

                  $('#userListContainer').append(userElement);

                  // Break out of the loop after appending 5 users
                  if ($('#userListContainer').children().length >= 5) {
                    break;
                  }
                }
              }

              $('.follow-button').click(async function () {
                let userLoginUser = localStorage.getItem('id');
                let userIdToFollow = $(this).data('user-id');
                let followButton = $(this);

                if (
                  userIdToFollow !== loggedInUserId &&
                  !isUserFollowed(userIdToFollow)
                ) {
                  followers.push(userIdToFollow);
                  let data = JSON.stringify({
                    users: followers,
                  });

                  // Display loading spinner
                  followButton.html(
                    '<i class="fa fa-spinner fa-spin"></i> Following...'
                  );

                  $.ajax({
                    url: `https://cms.istad.co/api/users/${userLoginUser}`,
                    type: 'PUT',
                    data: data,
                    contentType: 'application/json',
                    success: function (response) {
                      console.log('Successfully followed user:', response);

                      // You can update the UI to reflect the follow status if needed

                      // Set timeout to refresh data after 5 seconds
                      setTimeout(function () {
                        // Remove loading spinner
                        followButton.html('Follow');

                        // Fetch and display user data
                        fetchAndDisplayUserData();
                      }, 1000);
                    },
                    error: function (error) {
                      console.error('Error following user:', error);

                      // Remove loading spinner and revert to original text
                      followButton.html('Follow');
                    },
                  });
                } else {
                  console.log(
                    'User is already followed or is the current logged-in user.'
                  );
                }
              });
            },
            error: function (error) {
              console.error('Error fetching followers:', error);
            },
          });
        },
        error: function (error) {
          console.error('Error fetching user data:', error);
        },
      });
    }
  }

  // Function to check if a user is already followed
  function isUserFollowed(userId) {
    // Check if the user ID is in the followers array
    return followers.includes(userId);
  }

  // Fetch and display user data initially
  fetchAndDisplayUserData();
});