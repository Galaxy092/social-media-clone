'use strict';

// Get User Bio
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
      if (userBio.profile && userBio.profile.url) {
        // If a profile picture exists, set the image source to the URL
        $('#profilePic').attr(
          'src',
          'https://cms.istad.co' + userBio.profile.url ||
            'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
        );
        $('#userName').text(userBio.username || 'Unknown User');
        $('#userGmail').text(userBio.email || 'No email available');
      } else {
        // If no profile picture exists, set a default image
        $('#profilePic').attr(
          'src',
          'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
        );
        $('#userName').text(userBio.username || 'Unknown User');
        $('#userGmail').text(userBio.email || 'No email available');
      }

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
  $('#profilePic').attr('src', 'https://placehold.co/600x400');
  $('#userName').text('Guest User');
  $('#userGmail').text('No email available');

  // Redirect to login page when clicking on the guest profile
  $('#profileLink').on('click', function (event) {
    event.preventDefault(); // Prevent the default behavior of the anchor tag
    window.location.href = '/src/pages/login.html';
  });
}
function logout() {
  // Clear local storage
  localStorage.clear();
  // Clear toast sessionStorage
  sessionStorage.clear();

  window.location.href = '/src/pages/login.html';
}

function getUserInfo(userId) {
  $.ajax({
    type: 'PUT',
    url: `https://cms.istad.co/api/users/${userId}`, // Use backticks for template literals
    headers: {
      Authorization: 'Bearer ' + responseJwt,
    },
    success: function (data) {
      // Display User Info
      // For example, update the value of an input field with the fetched username
      $('#username').val(data.username);
      $('#email').val(data.email);
      $('#dateOfBirth').val(data.dateOfBirth);
      $('#gender').val(data.gender);
      $('#location').val(data.location);
      $('#education').val(data.education);
      $('#relationshipStatus').val(data.relationshipStatus);
      $('#workplace').val(data.workplace);
      $('#bio').val(data.bio);
      // Add similar lines for other fields you want to update

      // // update to profile
      // window.location.href = '/src/pages/profile.html';
    },
    error: function (error) {
      console.error('Error fetching user', error);
    },
  });
}

// Function to update user data
function updateUserInfo(userId, updatedData) {
  $.ajax({
    type: 'PUT',
    url: `https://cms.istad.co/api/users/${userId}`,
    headers: {
      Authorization: 'Bearer ' + responseJwt,
    },
    data: updatedData,
    success: function (data) {
      // Show toastr notification on successful update
      toastr.success('User data updated successfully');

      // Wait for a short delay (e.g., 2 seconds) before reloading the page
      setTimeout(function () {
        // Once the update action is completed, you can update the UI accordingly
        location.reload();
        // You can perform additional actions after a successful update
      }, 2000); // 2000 milliseconds (2 seconds)
    },
    error: function (error) {
      console.error('Error updating user data:', error);

      // Show toastr notification on error
      toastr.error('Error updating user data');
    },
  });
}

const userId = localStorage.getItem('id');
if (!userId) {
  // If user ID is not present, redirect to home.html
  window.location.replace('home.html');
}
getUserInfo(userId);

$(document).ready(function () {
  $('#submitBtn').click(function () {
    // Collect updated data from the form
    const updatedData = {
      username: $('#username').val(),
      email: $('#email').val(),
      dateOfBirth: $('#dateOfBirth').val(),
      gender: $('#gender').val(),
      location: $('#location').val(),
      education: $('#education').val(),
      relationshipStatus: $('#relationshipStatus').val(),
      workplace: $('#workplace').val(),
      bio: $('#bio').val(),
      // Add similar lines for other fields you want to update
    };

    updateUserInfo(userId, updatedData);
  });

  // Add cancel logic if needed
  $('#cancelBtn').click(function () {
    getUserInfo(userId);
  });
});

function validateAndCreatePost(event) {
  // Reset previous errors
  document.getElementById('titleError').classList.add('hidden');
  document.getElementById('fileError').classList.add('hidden');
  document.getElementById('descriptionError').classList.add('hidden');

  const title = document.getElementById('title').value;
  const fileInput = document.getElementById('file');
  const file = fileInput.files[0];
  const description = document.getElementById('message').value;

  // Validate Title
  if (!title.trim()) {
    document.getElementById('titleError').classList.remove('hidden');
    // Prevent modal from closing
    event.stopPropagation();
    return;
  }

  // Validate File
  if (!file) {
    document.getElementById('fileError').classList.remove('hidden');
    // Prevent modal from closing
    event.stopPropagation();
    return;
  }

  // Validate Description
  if (!description.trim()) {
    document.getElementById('descriptionError').classList.remove('hidden');
    // Prevent modal from closing
    event.stopPropagation();
    return;
  }

  // If validation passes, proceed to create post
  createPost();
}

// Function search by username
function findUsername() {
  let inputSearch = document.getElementById('input-search');
  let searchList = document.getElementById('search_list');
  let card = document.getElementById('search_card_list');
  card.innerHTML = '';

  let searchItem = inputSearch.value.trim();
  if (searchItem.length > 0) {
    searchList.classList.remove('hidden');

    fetch(
      `https://cms.istad.co/api/users?filters[username][$containsi]=${searchItem}&populate=*`
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        let items = data;
        if (items.length > 0) {
          items.forEach((data) => {
            card.innerHTML += `
              <a href="/src/pages/details.html?id=${data.id}">
                <li class="w-full px-2 py-2 border-b border-gray-200 flex items-center gap-2">
                  ${
                    data.profile?.url
                      ? `<img src="https://cms.istad.co${data.profile?.url}" alt="#" class="h-10 w-10 rounded-full object-cover" />`
                      : `<img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" class="relative inline-block w-10 h-10 rounded-full border-2 border-white object-cover object-center story-thumbnail" />`
                  }		  
                  <p>${data.username}</p>
                </li>
              </a>
            `;
          });
        } else {
          card.innerHTML =
            '<p class="w-full px-2 py-2 border-b border-gray-200 flex items-center gap-2">Username not found</p>';
        }
      });
  } else {
    searchList.classList.add('hidden');
  }
}

// Make AJAX request to get category data and populate the categories dynamically
$.ajax({
  url: 'https://cms.istad.co/api/sm-categories?populate=posts.photo,posts.user.profile',
  method: 'GET',
  dataType: 'json',
  success: function (data) {
    // Populate the categories dynamically
    data.data.forEach(function (category) {
      // Check if the category has posts
      if (category.attributes.posts.data.length > 0) {
        var html = `
          <div class="flex mx-4 gap-4">
            <div class="mt-3">
              <img src="/img/Arrow.svg" />
            </div>
            <div class="text-start">
              <p class="font-bold" onclick="onCategoryClick(${category.id})">${category.attributes.name}</p>
              <p class="text-base">${category.attributes.posts.data.length} posts</p>
            </div>
          </div>`;
        $('#categorySection').append(html);
      }
    });
  },
  error: function (error) {
    console.error('Error fetching data:', error);
  },
});

//Follow feature
$(document).ready(function () {
  var followers = [];

  function fetchAndDisplayUserData() {
    $('#userListContainer').empty();

    var loggedInUserId = localStorage.getItem('id');

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
                    <div class="flex gap-4">
                      <img class="h-10 w-10 rounded-full"
                        src="${profileImageUrl}"
                        alt="" />
                      <p class="text-start font-bold pt-2">${user.username}</p>
                    </div>
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

  // Function to check if a user is already followed
  function isUserFollowed(userId) {
    // Check if the user ID is in the followers array
    return followers.includes(userId);
  }

  // Fetch and display user data initially
  fetchAndDisplayUserData();
});