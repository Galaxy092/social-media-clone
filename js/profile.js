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
    $('#title').text(userBio.username + ' - Social Kh' || 'Guest User');
    // Check if the user has a profile picture
    if (userBio.profile && userBio.profile.url) {
      // If a profile picture exists, set the image source to the URL
      $('#profilePic').attr(
        'src',
        'https://cms.istad.co' + userBio.profile.url ||
          'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
      );
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
      $('#profileLocation').text(userBio.location || 'No User Location');
      $('#profileEducation').text(userBio.education || 'No User Education');
      $('#profileWorkplace').text(
        userBio.workplace || 'No workplace available'
      );
      $('#profileRelationshipStatus').text(
        userBio.relationshipStatus || 'No relationship status available'
      );
    }
    $('#profilePic').attr(
      'src',
      'https://cms.istad.co' + userBio.profile.url,
      'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
    );
    $('#profileImage').attr(
      'src',
      'https://cms.istad.co' + userBio.profile.url,
      'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
    );
    $('#userName').text(userBio.username || 'Unknown User');
    $('#profileUsername').text(userBio.username || 'Unknown User');
    $('#userGmail').text(userBio.email || 'No email available');
    $('#profileBio').text(userBio.bio || 'No bio available');
    $('#profileLocation').text(userBio.location || 'No User Location');
    $('#profileEducation').text(userBio.education || 'No User Education');
    $('#profileWorkplace').text(userBio.workplace || 'No workplace available');
    $('#profileRelationshipStatus').text(
      userBio.relationshipStatus || 'No relationship status available'
    );
  },
  error: function (error) {
    console.error('Error fetching user bio:', error);
  },
});

const userId = localStorage.getItem('id');
if (!userId) {
  // If user ID is not present, redirect to home.html
  window.location.replace('home.html');
}
// display all post
$(document).ready(function () {
  // Fetch post from the API
  $.ajax({
    url: `https://cms.istad.co/api/users/${userId}?populate=posts.photo,posts.user.profile,posts.comments.user.profile`,
    method: 'GET',
    dataType: 'json',
    success: function (data) {
      if (data.posts.length === 0) {
        // If the user has no posts, display a message
        $('.post').append(`
          <div class="wrapper mt-4">
            <p>No posts yet.</p>
          </div>
        `);
      } else {
        // Sort the posts array based on createdAt in descending order
        data.posts.sort(function (a, b) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        // Iterate through each story in the response
        $.each(data.posts, function (index, post) {
          // Function to handle sharing the post
          window.sharePost = function (postId) {
            // Get the post ID and copy to clipboard
            const postID = postId;
            copyToClipboard(postID);

            // Show toastr notification
            toastr.success('Copied to clipboard!');
          };

          // Append a new section for each story to the stories-container
          const postContainer = $('.post').append(`
              <!-- Edit modal -->
              <div id="editModal${
                post.id
              }" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                  <div class="relative p-4 w-full max-w-md max-h-full">
                      <!-- Modal content -->
                      <div class="relative bg-white rounded-lg shadow">
                          <!-- Modal header -->
                          <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                              <h3 class="text-lg font-semibold text-gray-900">
                                  Update Post
                              </h3>
                              <button onClick="hideEditModal(${
                                post.id
                              })" type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                                  <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                  </svg>
                                  <span class="sr-only">Close modal</span>
                              </button>
                          </div>
                          <!-- Modal body -->
                          <form id="editForm${
                            post.id
                          }" enctype="multipart/form-data" class="p-4 md:p-5">
                              <div class="grid gap-4 mb-4 grid-cols-2">
                                  <div class="col-span-2">
                                      <label for="title${
                                        post.id
                                      }" class="text-start block mb-2 text-sm font-medium text-gray-900">Title</label>
                                      <input type="text" value="${
                                        post.title
                                      }" name="title" id="title${
                                        post.id
                                      }" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required>
                                  </div>
                                  <div class="col-span-2">
                                      <label for="photo${
                                        post.id
                                      }" class="text-start block mb-2 text-sm font-medium text-gray-900">Post Photo</label>
                                      <input type="file" name="photo" id="photo${
                                        post.id
                                      }" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500" onchange="previewImageEdit(${
                                        post.id
                                      })">
                                      <img id="preview${
                                        post.id
                                      }" src="https://cms.istad.co${
                                        post?.photo?.url
                                      }" class="hidden"/>
                                      <!-- Existing photo ID (hidden input) -->
                                      <input type="hidden" id="existingPhoto${
                                        post.id
                                      }" value="${
                                        post?.photo?.id
                                      }">
                                  </div>
                                  <div class="col-span-2">
                                      <label for="detail${
                                        post.id
                                      }" class="text-start block mb-2 text-sm font-medium text-gray-900">Post Description</label>
                                      <textarea id="detail${
                                        post.id
                                      }" name="detail" rows="4" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500">${
                                        post.detail
                                      }</textarea>
                                  </div>
                              </div>
                              <button type="button" onclick="updatePost(${
                                post.id
                              })" class="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                  <svg class="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
                                  Update Post
                              </button>
                          </form>
                      </div>
                  </div>
              </div>                  

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
                              <!--dropdown-->
  
                              <div class="relative" id="dropdownButton bg-slate-100">
                                <div class="flex justify-end">
                                <div id="button" onclick="toggleDropdown(${
                                  post.id
                                })" class="cursor-pointer three-dot float-right mr-3 z-50">
                                  <i class='bx bx-dots-horizontal-rounded w-3 z-30'></i>
                                </div>
                                <div id="dropdown-${
                                  post.id
                                }" class="rounded bg-white absolute hidden p-2 mr-30 shadow-md my-10 text-start text-sm z-50">
                                  <div class="cursor-pointer hover:bg-gray-200 p-2 w-20 rounded" onclick="showEditModal(${
                                    post.id
                                  })"><a href="#">Edit</a></div>
                                  <div class="cursor-pointer hover:bg-gray-200 p-2 w-20 rounded" onclick="showDeleteModal(${
                                    post.id
                                  })"><a href="#">Delete</a></div>
                                </div>
                              </div>
                            </div>
                            
                            <!-- Delete Modal -->
                            <div id="deleteModal" class="fixed inset-0 items-center justify-center z-50 hidden shadow-md">
                              <div class="bg-gray-200 rounded-lg p-8">
                                <p class="text-lg text-center mb-4 ">Are you sure you want to delete this item?</p>
                                <div class="flex justify-center">
                                  <button class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-xl w-20 mr-4" onclick="deleteItem(${
                                    post.id
                                  })">Yes</button>
                                  <button class="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded-xl w-20" onclick="hideDeleteModal()">No</button>
                                </div>
                              </div>
                            </div>
                               <!--end dropdown-->
                          </div>
                        
                          <h2 class="font-semibold text-start">
                              ${post.title}
                          </h2>
                          <div class="py-4">
                              <div id="default-carousel" class="relative w-full" data-carousel="slide" data-index="${index}">
                                  <img class="w-full rounded-lg z-10" src="https://cms.istad.co${
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

          // Append the share icon and handle click event
          postContainer.find(`#dropdown-${post.id}`).append(`
            <div class="cursor-pointer hover:bg-gray-200 p-2 w-20 rounded" onclick="sharePost(${post.id})">
              <a href="#">Share</a>
            </div>
          `);
          if (post.comments && post.comments.length > 0) {
            // Sort comments by publishedAt in descending order
            post.comments.sort(
              (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
            );

            // Display only the latest two comments
            const latestComments = post.comments.slice(0, 5);
            $.each(latestComments, function (commentIndex, comment) {
              console.log(comment.user.id);
              let commentPf = `<img class="rounded-full max-w-none w-10 h-10 object-cover" src="https://cms.istad.co${comment.user.profile.url}" />`;
              let commentContent = `<p>${comment.comment}</p>`;
              let commentDate = `${formatDate(comment.publishedAt)}`;
              let commentUsername = `<a class="inline-block text-base font-bold mr-2" href="/src/pages/details.html?id=${comment.user.id}">${comment.user.username}</a>`;

              let userId = parseInt(localStorage.getItem('id'));
              let currentUser = comment.user.id === userId

              // Append each comment to the postContainer
              let commentElement = $(`
                    <!-- Comment row -->
                    <div class="media flex pb-4" id="comment_${comment.id}">
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
                              <button class="py-2 px-4 font-medium hover:bg-slate-50 rounded-lg">
                                Reply
                              </button>
                            </div>
                            </div>
                            <div class="dropdown ml-auto">
                                <button class="py-2 px-4 font-medium hover:bg-slate-50 rounded-lg dropdown-toggle" type="button" id="dropdownMenuButton_${comment.id}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
                                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton_${comment.id}">
                                ${currentUser ? '<a class="dropdown-item delete-comment-btn" href="#">Delete</a>' : ''}
                                    <!-- Add other dropdown options if needed -->
                                </div>
                            </div>
                    </div>
                `);

              // Handle delete button click event
              commentElement
                .find('.delete-comment-btn')
                .on('click', function () {
                  // Assuming comment.id is the identifier for the comment
                  deleteComment(comment.id, commentElement);
                });

              postContainer
                .find(`#commentsContainer_${index}`)
                .append(commentElement);
            });
          }
          //append post and the comment part together
          $('.post').append(postContainer);

          //Create comment section
          $('.post').on('click', `#commentSend_${index}`, function () {
            let userId = localStorage.getItem('id');
            let commentText = $(`.comment-input_${index}`).val();

            $(document).ready(function () {
              if (!userId) {
                // User is not logged in, show toastr message
                toastr.warning('Please login to comment.');
                $(`.comment-input_${index}`).val('');
                return;
              }
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

//dropdown

function toggleDropdown(id) {
  let dropdown = document.querySelector(`#dropdown-${id}`);
  dropdown.classList.toggle('hidden');
}

function showIconByIndex(dropdownIndex, iconIndex) {
  let dropdowns = document.querySelectorAll('.relative');
  if (dropdownIndex >= 0 && dropdownIndex < dropdowns.length) {
    let dropdown = dropdowns[dropdownIndex];
    let icons = dropdown.querySelectorAll('i');
    if (iconIndex >= 0 && iconIndex < icons.length) {
      icons[iconIndex].classList.remove('hidden');
    }
  }
}
//modal yes no
function showDeleteModal(postId) {
  // Show the delete modal
  document.getElementById('deleteModal').classList.remove('hidden');
}

function hideDeleteModal() {
  // Hide the delete modal
  document.getElementById('deleteModal').classList.add('hidden');
}
//api delete
function deleteItem(postId) {
  // Perform the delete action using the postId
  const apiUrl = `https://cms.istad.co/api/sm-posts/${postId}`;

  fetch(apiUrl, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (response.ok) {
        console.log(`Item with ID ${postId} has been deleted.`);

        // Show toastr notification for successful deletion
        toastr.success('Post has been deleted.');

        // Wait for a short delay (e.g., 2 seconds) before reloading the page
        setTimeout(function () {
          // Once the delete action is completed, you can update the UI accordingly
          location.reload();
          // You can perform additional actions after a successful update
        }, 2000); // 2000 milliseconds (2 seconds)
      } else {
        console.log(`Failed to delete item with ID ${postId}.`);
        // Handle the error case appropriately
      }
    })
    .catch((error) => {
      console.log(`An error occurred while deleting item with ID ${postId}.`);
      console.error(error);
      // Handle the error case appropriately
    })
    .finally(() => {
      // Once the delete action is completed (success or failure), you can hide the modal
      hideDeleteModal();
    });
}

function showDeleteModal(postId) {
  // Show the delete modal
  document.getElementById('deleteModal').classList.remove('hidden');
  document.getElementById('deleteModal').classList.add('flex');

  // Store the postId in a global variable
  window.currentPostId = postId;
}

function hideDeleteModal() {
  // Hide the delete modal
  document.getElementById('deleteModal').classList.add('hidden');
}

// Function to copy text to clipboard
function copyToClipboard(text) {
  const baseUrl = 'https://social-kh.vercel.app'; // Replace with your actual production URL
  const tempInput = $('<input>');
  $('body').append(tempInput);
  tempInput.val(`${baseUrl}/src/pages/post.html?id=${text}`).select();
  document.execCommand('copy');
  tempInput.remove();
}

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

// Function to delete a comment
function deleteComment(commentId, commentElement) {
  $.ajax({
    url: `https://cms.istad.co/api/sm-comments/${commentId}`,
    type: 'DELETE',
    success: function () {
      // Remove the comment from the UI
      commentElement.remove();

      // Show toastr notification on success
      toastr.success('Comment deleted successfully');
    },
    error: function (error) {
      console.error(
        `Error deleting comment with ID ${commentId}: ${error.responseText}`
      );
    },
  });
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

// Function to show the edit modal
function showEditModal(postId) {
  const modal = $(`#editModal${postId}`);
  modal.removeClass('hidden').addClass('flex');
}

// Function to hide the edit modal
function hideEditModal(postId) {
  $(`#editModal${postId}`).addClass('hidden');
}

// Function to preview image during edit
function previewImageEdit(postId) {
  const fileInput = $(`#photo${postId}`)[0];
  const preview = $(`#preview${postId}`);
  const labelPreview = $(`#labelPreview${postId}`);

  if (fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();

    reader.onload = (e) => {
      preview.attr('src', e.target.result).removeClass('hidden');
      labelPreview.removeClass('hidden');
    };

    reader.readAsDataURL(fileInput.files[0]);
  }
}

// Function to clear image preview during edit
function clearPreviewImage(postId) {
  const preview = $(`#preview${postId}`);
  const fileInput = $(`#photo${postId}`);

  preview.attr('src', '').addClass('hidden');
  fileInput.val('');
}

// Function to update a post
async function updatePost(postId) {
  const title = $(`#title${postId}`).val();
  const fileInput = $(`#photo${postId}`)[0];
  const files = fileInput.files;
  const description = $(`#detail${postId}`).val();
  const userId = localStorage.getItem('id');

  let imageId;

  if (files.length > 0) {
    imageId = await uploadImage(files);

    if (!imageId) {
      toastr.error('Failed to upload image. Check the console for details.');
      return;
    }

    const preview = $(`#preview${postId}`);
    preview.attr('src', URL.createObjectURL(fileInput.files[0]));
  }

  const post = {
    url: `https://cms.istad.co/api/sm-posts/${postId}`,
    method: 'PUT',
    timeout: 0,
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      data: {
        title,
        detail: description,
        photo: imageId ? imageId[0].id : $(`#existingPhoto${postId}`).val(),
        user: userId,
      },
    }),
  };

  $.ajax(post)
    .done((response) => {
      if (response && response.data && response.data.id) {
        toastr.success('Post updated successfully!');
        setTimeout(() => location.reload(), 2000);

        if (files.length > 0) {
          clearPreviewImage(postId);
        }

        $(`#title${postId}, #photo${postId}, #detail${postId}`).val('');
        hideEditModal(postId);
      } else {
        toastr.error('Failed to update post. Check the console for details.');
      }
    })
    .fail((jqXHR, textStatus, errorThrown) => {
      console.error('Error updating post:', textStatus, errorThrown);
      toastr.error('Failed to update post. Check the console for details.');
    });
}