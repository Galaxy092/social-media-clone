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
        $('#profileImage').attr(
          'src',
          'https://cms.istad.co' + userBio.profile.url ||
            'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
        );
        $('#userName').text(userBio.username || 'Unknown User');
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
  $('#profilePic').attr(
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

function getIDFromUrl() {
  const url = new URLSearchParams(window.location.search);
  const id = url.get('id');
  return id;
}

$(document).ready(function () {
  // Fetch post from the API
  $.ajax({
    url: `https://cms.istad.co/api/users?filters[id][$eqi]=${getIDFromUrl()}&populate=posts.photo,profile,posts.user.profile,posts.comments.user.profile`,
    method: 'GET',
    dataType: 'json',
    success: function (data) {
      $('#title').text(data[0].username + ' - Social Kh');
      // Check if the user has a profile picture
      if (data[0].profile && data[0].profile.url) {
        // If a profile picture exists, set the image source to the URL
        $('#profileImage').attr(
          'src',
          'https://cms.istad.co' + data[0].profile.url
        );
      } else {
        // If no profile picture exists, set a default image
        $('#profileImage').attr(
          'src',
          'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
        );
      }
      $('#profileUsername').text(data[0].username || 'Unknown User');
      $('#profileBio').text(data[0].bio || 'No bio available');
      $('#profileLocation').text(data[0].location || 'No User Location');
      $('#profileEducation').text(data[0].education || 'No User Education');
      $('#profileWorkplace').text(
        data[0].workplace || 'No workplace available'
      );
      $('#profileRelationshipStatus').text(
        data[0].relationshipStatus || 'No relationship status available'
      );
      // Sort the posts array based on createdAt in descending order
      data[0].posts.sort(function (a, b) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      // Check if there are posts available
      if (data.length > 0 && data[0].posts.length > 0) {
        // Iterate through each story in the response
        $.each(data[0].posts, function (index, post) {
          // Append a new section for each story to the stories-container
          const postContainer = $('.post').append(`
          <!-- Wrapper-->
          <div class="wrapper mt-4">
              <!-- Content grid -->
              <div class="max-w-7xl mx-auto">
                  <!-- Card-->
                  <article class="mb-4 break-inside p-6 rounded-xl bg-white">
                      <div class="flex pb-6 items-center justify-between">
                          <div class="flex">
                              <a class="inline-block mr-4" href="#">
                                  <img src="https://cms.istad.co${
                                    post?.user?.profile?.url
                                  }" class="rounded-full max-w-none w-14 h-14" src="" />
                              </a>
                              <div class="flex flex-col">
                                  <h6 class="inline-block text-lg font-bold text-start">
                                    <a href="#">${post?.user?.username}</a>
                                  </h6>

                                  <div class="text-slate-500" id="formattedDate">
                                    ${formatDate(post.createdAt)}
                                  </div>
                              </div>
                          </div>
                      </div>
                      <h2 class="font-semibold text-start">
                          ${post.title}
                      </h2>
                      <div class="py-4">
                          <div id="default-carousel" class="relative w-full" data-carousel="slide" data-index="${index}">
                              <img class="w-full rounded-lg" src="https://cms.istad.co${
                                post.photo.url
                              }">
                          </div>
                      </div>
                      <p class="text-start">
                          ${post.detail}
                      </p>
                      <div class="py-4 text-start">
                          <a class="inline-flex items-center" href="#">
                              <span class="mr-2">
                                  <svg class="fill-rose-600 w-6 h-6" viewBox="0 0 24 24">
                                      <path
                                          d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z">
                                      </path>
                                  </svg>
                              </span>
                              <span class="text-lg font-bold">0</span>
                          </a>
                          <a class="inline-flex items-center" href="#">
                              <span class="ml-2">
                                  <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                      <path
                                          d="M123.6 391.3c12.9-9.4 29.6-11.8 44.6-6.4c26.5 9.6 56.2 15.1 87.8 15.1c124.7 0 208-80.5 208-160s-83.3-160-208-160S48 160.5 48 240c0 32 12.4 62.8 35.7 89.2c8.6 9.7 12.8 22.5 11.8 35.5c-1.4 18.1-5.7 34.7-11.3 49.4c17-7.9 31.1-16.7 39.4-22.7zM21.2 431.9c1.8-2.7 3.5-5.4 5.1-8.1c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208s-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6c-15.1 6.6-32.3 12.6-50.1 16.1c-.8 .2-1.6 .3-2.4 .5c-4.4 .8-8.7 1.5-13.2 1.9c-.2 0-.5 .1-.7 .1c-5.1 .5-10.2 .8-15.3 .8c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c4.1-4.2 7.8-8.7 11.3-13.5c1.7-2.3 3.3-4.6 4.8-6.9c.1-.2 .2-.3 .3-.5z" />
                                  </svg>
                              </span>
                          </a>
                          <a class="inline-flex items-center" href="#">
                              <span class="ml-2">
                                  <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" height="16" width="16"
                                      viewBox="0 0 512 512">
                                      <path
                                          d="M16.1 260.2c-22.6 12.9-20.5 47.3 3.6 57.3L160 376V479.3c0 18.1 14.6 32.7 32.7 32.7c9.7 0 18.9-4.3 25.1-11.8l62-74.3 123.9 51.6c18.9 7.9 40.8-4.5 43.9-24.7l64-416c1.9-12.1-3.4-24.3-13.5-31.2s-23.3-7.5-34-1.4l-448 256zm52.1 25.5L409.7 90.6 190.1 336l1.2 1L68.2 285.7zM403.3 425.4L236.7 355.9 450.8 116.6 403.3 425.4z" />
                                  </svg>
                              </span>
                          </a>
                          <a class="inline-flex items-center float-right" href="#">
                              <span class="ml-2">
                                  <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" height="16" width="12"
                                      viewBox="0 0 384 512">
                                      <path
                                          d="M0 48C0 21.5 21.5 0 48 0l0 48V441.4l130.1-92.9c8.3-6 19.6-6 27.9 0L336 441.4V48H48V0H336c26.5 0 48 21.5 48 48V488c0 9-5 17.2-13 21.3s-17.6 3.4-24.9-1.8L192 397.5 37.9 507.5c-7.3 5.2-16.9 5.9-24.9 1.8S0 497 0 488V48z" />
                                  </svg>
                              </span>
                          </a>
                      </div>
                      <div class="relative">
                      <input
                          class="comment-input_${index} pt-2 pb-2 pl-3 w-full h-11 bg-slate-100 rounded-lg placeholder:text-slate-600 font-medium pr-20"
                          type="text" data-post-id="${
                            post.id
                          }" placeholder="Write a comment" />
                      <span id="commentSend_${index}" class="flex absolute right-3 top-2/4 -mt-3 items-center">
                          <svg class="fill-blue-500" style="width: 24px; height: 24px;"
                              viewBox="0 0 24 24">
                              <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z"></path>
                          </svg>
                      </span>
                  </div>
                      <!-- Comments content -->
                      <div class="comments-section">
                        <div class="pt-6" id="commentsContainer_${index}">
                        </div>
                      </div>
                        <!-- End comments row -->
                        <!-- More comments -->
                  </article>
                  <!-- End Card -->
              </div>
          </div>
          <!-- End Wrapper-->
      </section>
          `);
          if (post.comments && post.comments.length > 0) {
            $.each(post.comments, function (commentIndex, comment) {
              let commentPf = `<img class="rounded-full max-w-none w-10 h-10 object-cover"
                  src="https://cms.istad.co${comment.user.profile.url}" />`;
              let commentContent = `<p>${comment.comment}</p>`;
              let commentDate = `${formatDate(comment.publishedAt)}`;
              let commentUsername = `<a class="inline-block text-base font-bold mr-2" href="/src/pages/details.html?id=${comment.user.id}">${comment.user.username}</a>`;

              // Append each comment to the postContainer
              postContainer.find(`#commentsContainer_${index}`).append(`
                  <!-- Comment row -->
                  <div class="media flex pb-4">
                      <a class="mr-4" href="#">
                        ${commentPf}
                      </a>
                      <div class="media-body text-start">
                          <div>
                              ${commentUsername}
                              <span class="text-slate-500">${commentDate}</span>
                          </div>
                          ${commentContent}
                          <div class="mt-2 flex items-center">
                              <a class="inline-flex items-center py-2 mr-3" href="#">
                                  <span class="mr-2">
                                      <svg class="fill-rose-600" style="width: 22px; height: 22px;"
                                          viewBox="0 0 24 24">
                                          <path
                                              d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z">
                                          </path>
                                      </svg>
                                  </span>
                                  <span class="text-base font-bold">0</span>
                              </a>
                              <button class="py-2 px-4 font-medium hover:bg-slate-50 rounded-lg">
                                  Reply
                              </button>
                          </div>
                      </div>
                  `);
            });
          }
          //append post and the comment part together
          $('.post').append(postContainer);

          //Create comment section
          $('.post').on('click', `#commentSend_${index}`, function () {
            let userId = localStorage.getItem('id');
            let commentText = $(`.comment-input_${index}`).val();

            $(document).ready(function () {
              // Fetch stories from the API
              $.ajax({
                url: 'https://cms.istad.co/api/sm-comments',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                  data: {
                    comment: commentText,
                    user: userId,
                    post: post.id,
                  },
                }),
                success: function (response) {
                  // Iterate through each story in the response
                  location.reload();
                  console.log(response);
                  toastr.success('Comment successful!');
                },
                error: function (error) {
                  console.error('Error create comment:', error);
                },
              });
            });
          });
        });
      } else {
        // Display a message when there are no posts
        const noPostMessage = `<p>No posts yet.</p>`;
        $('.post').append(noPostMessage);
      }
    },
    error: function (error) {
      console.error('Error fetching stories:', error);
    },
  });
});

function formatDate(dateString) {
  const date = new Date(dateString);
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC', // Adjust the time zone according to your needs
  }).format(date);

  return formattedDate;
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