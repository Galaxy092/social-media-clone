'use strict';

const userId = localStorage.getItem('id');
if (!userId) {
  // If user ID is not present, redirect to home.html
  window.location.replace('home.html');
}

// Get User Bio
const responseJwt = localStorage.getItem('token');
$(document).ready(function () {
  const container = $('#friend-list-container');

  $.ajax({
    type: 'GET',
    url: 'https://cms.istad.co/api/users/me?populate=*',
    headers: {
      Authorization: 'Bearer ' + responseJwt,
    },
    success: function (userBio) {
      if (userBio && userBio.users) {
        // Clear existing content in the container
        container.empty();

        // Loop through the friend list and create cards
        userBio.users.forEach((user) => {
          const card = `
            <div>
              <a href="/src/pages/details.html?id=${user.id}">
              <img src="${
                user?.profile?.url
                  ? `https://cms.istad.co${user?.profile?.url}`
                  : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
              }" class="user-image lg:w-[220px] lg:h-[240px] md:w-[220px] md:h-[240px] sm:w-[180px] sm:h-[200px] rounded-lg" alt="User Image">
              <p class="user-username text-left">${user.username}</p>
              </a>
            </div>
          `;

          // Append the card to the container
          container.append(card);
        });
      }

      // Display User Info
      // Update the DOM with the fetched data
      if (userBio.profile && userBio.profile.url) {
        // If a profile picture exists, set the image source to the URL
        $('#profilePic').attr(
          'src',
          'https://cms.istad.co' + userBio.profile.url ||
            'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
        );
        $('#profileImage').attr(
          'src',
          'https://cms.istad.co' + userBio.profile.url ||
            'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
        );
        $('#userName').text(userBio.username || 'Unknown User');
        $('#profileUsername').text(userBio.username || 'Unknown User');
        $('#userGmail').text(userBio.email || 'No email available');
        $('#profileBio').text(userBio.bio || 'No bio available');
      } else {
        // If no profile picture exists, set a default image
        $('#profileImage').attr(
          'src',
          'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
        );
        $('#profilePic').attr(
          'src',
          'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
        );
        $('#userName').text(userBio.username || 'Unknown User');
        $('#profileUsername').text(userBio.username || 'Unknown User');
        $('#userGmail').text(userBio.email || 'No email available');
        $('#profileBio').text(userBio.bio || 'No bio available');
      }
    },
    error: function (error) {
      console.error('Error fetching user bio:', error);
    },
  });
});

function logout() {
  // Clear local storage
  localStorage.clear();
  // Clear toast sessionStorage
  sessionStorage.clear();

  window.location.href = '/src/pages/login.html';
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

  // Function to check if a user is already followed
  function isUserFollowed(userId) {
    // Check if the user ID is in the followers array
    return followers.includes(userId);
  }

  // Fetch and display user data initially
  fetchAndDisplayUserData();
});

// Function to fetch user profile data and update the profile image
function fetchUserProfile() {
  const userId = localStorage.getItem('id');
  $.ajax({
    url: `https://cms.istad.co/api/users/${userId}?populate=profile`,
    type: 'GET',
    dataType: 'json',
    success: function (data) {
      // Check if the user has a profile picture
      const hasProfilePicture = data.profile && data.profile.url;

      // Set the default profile picture URL
      const defaultProfilePictureURL =
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';

      // Use the profile picture URL if available, otherwise use the default
      const profilePictureURL = hasProfilePicture
        ? `https://cms.istad.co${data.profile.url}`
        : defaultProfilePictureURL;
      // Update the src attribute of an image tag with the profile picture URL
      $('#old_profile_picture').attr('src', profilePictureURL);
    },
    error: function (error) {
      console.error('Error fetching user profile:', error);
      // Handle the error as needed, e.g., show a default profile picture
      $('#old_profile_picture').attr(
        'src',
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
      );
    },
  });
}

// Function to update the profile
async function updateProfile() {
  const fileInput = $('#new_profile_picture_input')[0]; // Assuming you have a single file input
  const files = fileInput.files;
  const imageId = await uploadImage(files);

  let newProfile = {
    profile: imageId[0].id,
  };

  $.ajax({
    url: `https://cms.istad.co/api/users/${userId}`,
    type: 'PUT',
    contentType: 'application/json',
    data: JSON.stringify(newProfile),
    headers: {
      Authorization: `Bearer ${responseJwt}`,
    },
    success: function (data) {
      // Show Toastr notification
      toastr.success('Profile picture updated successfully');

      // Reload the page after a short delay (you can adjust the delay as needed)
      setTimeout(function () {
        location.reload();
      }, 1000);
    },
    error: function (e) {
      console.log(e);
      // Show Toastr notification for error
      toastr.error('Error updating profile picture');
    },
  });
}

async function uploadImage(files) {
  const formData = new FormData();

  // Handle multiple files
  for (const file of files) {
    formData.append('files', file);
  }

  try {
    const res = await fetch('https://cms.istad.co/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`Failed to upload image. Status: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error; // Rethrow the error to handle it in the calling function
  }
}

// Function to handle new image selection
function handleImageSelection() {
  const newProfilePictureInput = $('#new_profile_picture_input')[0];

  // Check if a file is selected
  if (newProfilePictureInput.files.length > 0) {
    const newProfilePictureFile = newProfilePictureInput.files[0];
    const newProfilePictureURL = URL.createObjectURL(newProfilePictureFile);

    // Update the src attribute of the old profile picture with the new one
    $('#old_profile_picture').attr('src', newProfilePictureURL);
  }
}

// Attach the handleImageSelection function to the change event of the input
$('#new_profile_picture_input').on('change', handleImageSelection);

// Call fetchUserProfile to initially load the old profile picture
fetchUserProfile();

// Function to handle the click event on the camera icon
$('#cameraIcon').click(function () {
  // Fetch user profile data and update the profile image
  fetchUserProfile();
});
