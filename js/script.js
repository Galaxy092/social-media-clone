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
      $('#profilePic').attr(
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

  // Update the button text after logout
  updateButtonBasedOnLocalStorage();

  window.location.href = '/src/pages/login.html';
}

// function logout() {
//   // Clear local storage
//   localStorage.clear();
//   // Clear toast sessionStorage
//   sessionStorage.clear();

//   window.location.href = '/src/pages/login.html';
// }

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
      // Iterate through the latest stories and append a new section for each to the stories-container
      $.each(data.data, function (index, story) {
        $('#stories-container').append(`
          <section class="flex-shrink-0 rounded-full border-2 w-3/12 sm:w-2/5 md:w-3/12 lg:w-[200px]">
            <a href='/src/pages/story.html'>
              <div class="relative grid h-[20rem] w-full max-w-[28rem] flex-col items-end justify-center overflow-hidden rounded-xl bg-white bg-clip-border text-center text-gray-700">
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
                  ${
                    story?.attributes?.user?.data?.attributes?.profile?.data
                      ?.attributes?.url
                      ? `<img alt="..." src="https://cms.istad.co${story?.attributes?.user?.data?.attributes?.profile?.data?.attributes?.url}" class="relative inline-block w-10 h-10 rounded-full border-2 border-white object-cover object-center story-thumbnail" />`
                      : `<img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" class="relative inline-block w-10 h-10 rounded-full border-2 border-white object-cover object-center story-thumbnail" />`
                  }
                </div>
              </div>
            </a>
          </section>
        `);
      });
    },
    error: function (error) {
      console.error('Error fetching stories:', error);
    },
  });
});

function getIDFromUrl() {
  const url = new URLSearchParams(window.location.search);
  const id = url.get('id');
  return id;
}

// display all post
// $(document).ready(function () {
//   // Fetch post from the API
//   $.ajax({
//     url: 'https://cms.istad.co/api/sm-posts?populate=photo,user.profile,comments.user.profile',
//     method: 'GET',
//     dataType: 'json',
//     success: function (data) {
//       // Sort the data array based on created_at in descending order
//       data.data.sort(function (a, b) {
//         return (
//           new Date(b.attributes.createdAt) - new Date(a.attributes.createdAt)
//         );
//       });
//       $.each(data.data, function (index, post) {
//         const postContainer = $('.post').append(`
//             <!-- Wrapper-->
//             <div class="wrapper">
//                 <!-- Content grid -->
//                 <div class="max-w-7xl mx-auto">
//                     <!-- Card-->
//                     <article class="mb-4 break-inside p-6 rounded-xl bg-white">
//                         <div class="flex pb-6 items-center justify-between">
//                             <div class="flex">
//                                 <a class="inline-block mr-4" href="/src/pages/details.html?id=${
//                                   post.attributes.user.data.id
//                                 }">
//                                     <img src="https://cms.istad.co${
//                                       post.attributes.user.data.attributes
//                                         .profile.data.attributes.url
//                                     }" class="rounded-full max-w-none w-14 h-14" src="" />
//                                 </a>
//                                 <div class="flex flex-col">
//                                     <h6 class="inline-block text-lg font-bold text-start">
//                                       <a href="/src/pages/details.html?id=${
//                                         post.attributes.user.data.id
//                                       }">${
//           post.attributes?.user?.data?.attributes?.username
//         }</a>
//                                     </h6>

//                                     <div class="text-slate-500" id="formattedDate">
//                                       ${formatDate(post.attributes.createdAt)}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         <h2 class="font-semibold text-start">
//                             ${post.attributes.title}
//                         </h2>
//                         <div class="py-4">
//                             <div id="default-carousel" class="relative w-full" data-carousel="slide" data-index="${index}">
//                                 <img class="w-full rounded-lg" src="https://cms.istad.co${
//                                   post.attributes.photo.data.attributes.url
//                                 }">
//                             </div>
//                         </div>
//                         <p class="text-start">
//                             ${post.attributes.detail}
//                         </p>
//                         <div class="py-4 text-start">
//                             <a class="inline-flex items-center" href="#">
//                                 <span class="mr-2">
//                                     <svg class="fill-rose-600 w-6 h-6" viewBox="0 0 24 24">
//                                         <path
//                                             d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z">
//                                         </path>
//                                     </svg>
//                                 </span>
//                                 <span class="text-lg font-bold">34</span>
//                             </a>
//                             <a class="inline-flex items-center" href="#">
//                                 <span class="ml-2">
//                                     <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
//                                         <path
//                                             d="M123.6 391.3c12.9-9.4 29.6-11.8 44.6-6.4c26.5 9.6 56.2 15.1 87.8 15.1c124.7 0 208-80.5 208-160s-83.3-160-208-160S48 160.5 48 240c0 32 12.4 62.8 35.7 89.2c8.6 9.7 12.8 22.5 11.8 35.5c-1.4 18.1-5.7 34.7-11.3 49.4c17-7.9 31.1-16.7 39.4-22.7zM21.2 431.9c1.8-2.7 3.5-5.4 5.1-8.1c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208s-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6c-15.1 6.6-32.3 12.6-50.1 16.1c-.8 .2-1.6 .3-2.4 .5c-4.4 .8-8.7 1.5-13.2 1.9c-.2 0-.5 .1-.7 .1c-5.1 .5-10.2 .8-15.3 .8c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c4.1-4.2 7.8-8.7 11.3-13.5c1.7-2.3 3.3-4.6 4.8-6.9c.1-.2 .2-.3 .3-.5z" />
//                                     </svg>
//                                 </span>
//                             </a>
//                             <a class="inline-flex items-center share-icon" href="#" data-post-id="123">
//                                 <span class="ml-2">
//                                     <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512">
//                                         <path
//                                             d="M16.1 260.2c-22.6 12.9-20.5 47.3 3.6 57.3L160 376V479.3c0 18.1 14.6 32.7 32.7 32.7c9.7 0 18.9-4.3 25.1-11.8l62-74.3 123.9 51.6c18.9 7.9 40.8-4.5 43.9-24.7l64-416c1.9-12.1-3.4-24.3-13.5-31.2s-23.3-7.5-34-1.4l-448 256zm52.1 25.5L409.7 90.6 190.1 336l1.2 1L68.2 285.7zM403.3 425.4L236.7 355.9 450.8 116.6 403.3 425.4z" />
//                                     </svg>
//                                 </span>
//                             </a>
//                             <a class="inline-flex items-center float-right" href="#">
//                                 <span class="ml-2">
//                                     <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" height="16" width="12"
//                                         viewBox="0 0 384 512">
//                                         <path
//                                             d="M0 48C0 21.5 21.5 0 48 0l0 48V441.4l130.1-92.9c8.3-6 19.6-6 27.9 0L336 441.4V48H48V0H336c26.5 0 48 21.5 48 48V488c0 9-5 17.2-13 21.3s-17.6 3.4-24.9-1.8L192 397.5 37.9 507.5c-7.3 5.2-16.9 5.9-24.9 1.8S0 497 0 488V48z" />
//                                     </svg>
//                                 </span>
//                             </a>
//                         </div>

//                         <div class="relative">
//                             <input
//                                 class="pt-2 pb-2 pl-3 w-full h-11 bg-slate-100 rounded-lg placeholder:text-slate-600 font-medium pr-20"
//                                 type="text" placeholder="Write a comment" />
//                             <span class="flex absolute right-3 top-2/4 -mt-3 items-center">
//                                 <svg class="fill-blue-500" style="width: 24px; height: 24px;"
//                                     viewBox="0 0 24 24">
//                                     <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z"></path>
//                                 </svg>
//                             </span>
//                         </div>

//                         <!-- Comments content -->
//                         <div class="comments-section">
//                           <div class="pt-6" id="commentsContainer_${index}">
//                           </div>
//                         </div>
//                     </div>
//                           <!-- End comments row -->
//                           <!-- More comments -->

//                     </article>
//                     <!-- End Card -->
//                 </div>
//             </div>
//             <!-- End Wrapper-->
//           </section>
//             `);
//         // console.log(post.attributes.comments.data.length)
//         // console.log(post.attributes.comments)

//         //Load comments
//         if (
//           post.attributes.comments &&
//           post.attributes.comments.data.length > 0
//         ) {
//           $.each(
//             post.attributes.comments.data,
//             function (commentIndex, comment) {
//               //console.log(comment.attributes.comment)
//               let commentPf = `<img class="rounded-full max-w-none w-10 h-10 object-cover"
//                 src="https://cms.istad.co${comment.attributes.user.data.attributes.profile.data.attributes.url}" />`;
//               let commentContent = `<p>${comment.attributes.comment}</p>`;
//               let commentDate = `${formatDate(comment.attributes.publishedAt)}`;
//               let commentUsername = `<a class="inline-block text-base font-bold mr-2" href="/src/pages/details.html?id=${comment.attributes.user.data.id}">${comment.attributes.user.data.attributes.username}</a>`;

//               // Append each comment to the postContainer
//               postContainer.find(`#commentsContainer_${index}`).append(`
//                 <!-- Comment row -->
//                 <div class="media flex pb-4">
//                     <a class="mr-4" href="/src/pages/details.html?id=${comment.attributes.user.data.id}">
//                       ${commentPf}
//                     </a>
//                     <div class="media-body text-start">
//                         <div>
//                             ${commentUsername}
//                             <span class="text-slate-500">${commentDate}</span>
//                         </div>
//                         ${commentContent}
//                         <div class="mt-2 flex items-center">
//                             <a class="inline-flex items-center py-2 mr-3" href="#">
//                                 <span class="mr-2">
//                                     <svg class="fill-rose-600" style="width: 22px; height: 22px;"
//                                         viewBox="0 0 24 24">
//                                         <path
//                                             d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z">
//                                         </path>
//                                     </svg>
//                                 </span>
//                                 <span class="text-base font-bold">0</span>
//                             </a>
//                             <button class="py-2 px-4 font-medium hover:bg-slate-50 rounded-lg">
//                                 Reply
//                             </button>
//                         </div>
//                     </div>
//                 `);
//             }
//           );
//         }

//         //append post and the comment part together
//         $('.post').append(postContainer);
//       });
//     },
//     error: function (error) {
//       console.error('Error fetching stories:', error);
//     },
//   });
// });

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

function updatePostSection(categoryId) {
  $.ajax({
    url: `https://cms.istad.co/api/sm-categories/${categoryId}?populate=posts.photo,posts.user.profile,posts.comments.user.profile`,
    method: 'GET',
    dataType: 'json',
    success: function (categoryData) {
      console.log(categoryData.data.attributes.posts.data);
      //console.log(categoryData.posts.data);

      // Get the posts related to the selected category
      const posts = categoryData.data.attributes.posts.data;

      // Randomize the order of posts
      const shuffledPosts = posts.sort(() => Math.random() - 0.5);

      // Clear existing content
      $('.post').empty();

      // Iterate through the shuffled posts and append them to the post section
      shuffledPosts.forEach(function (post, index) {
        console.log(post.attributes.user.data.attributes.url);
        // Append a new section for each post to the post section
        const postContainer = $('.post').append(`
              <!-- Wrapper-->
              <div class="wrapper">
                  <!-- Content grid -->
                  <div class="max-w-7xl mx-auto">
                      <!-- Card-->
                      <article class="mb-4 break-inside p-6 rounded-xl bg-white">
                          <div class="flex pb-6 items-center justify-between">
                              <div class="flex">
                                  <a class="inline-block mr-4" href="/src/pages/details.html?id=${
                                    post.attributes.user.data.id
                                  }">
                                      <img src="https://cms.istad.co${
                                        post.attributes.user.data.attributes
                                          .profile.data.attributes.url
                                      }" class="rounded-full max-w-none w-14 h-14" src="" />
                                  </a>
                                  <div class="flex flex-col">
                                      <h6 class="inline-block text-lg font-bold text-start">
                                        <a href="/src/pages/details.html?id=${
                                          post.attributes.user.data.id
                                        }">${
          post.attributes?.user?.data?.attributes?.username
        }</a>
                                      </h6>
                                    
                                      <div class="text-slate-500" id="formattedDate">
                                        ${formatDate(post.attributes.createdAt)}
                                      </div>
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
                                  <div class="cursor-pointer hover:bg-gray-200 p-2 w-20 rounded"><a href="#">Edit</a></div>
                                  <div class="cursor-pointer hover:bg-gray-200 p-2 w-20 rounded" onclick="showDeleteModal(${
                                    post.id
                                  })"><a href="#">Delete</a></div>
                                </div>
                              </div>
                            </div>
                               <!--end dropdown-->
                          </div>
                          <h2 class="font-semibold text-start">
                              ${post.attributes.title}
                          </h2>
                          <div class="py-4">
                              <div id="default-carousel" class="relative w-full" data-carousel="slide">
                                  <img class="w-full rounded-lg" src="https://cms.istad.co${
                                    post.attributes.photo?.data.attributes.url
                                  }">
                              </div>
                          </div>
                          <p class="text-start">
                              ${post.attributes.detail}
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
                                  <span class="text-lg font-bold">34</span>
                              </a>
                              <a class="inline-flex items-center" href="#">
                                  <span class="ml-2">
                                      <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                          <path
                                              d="M123.6 391.3c12.9-9.4 29.6-11.8 44.6-6.4c26.5 9.6 56.2 15.1 87.8 15.1c124.7 0 208-80.5 208-160s-83.3-160-208-160S48 160.5 48 240c0 32 12.4 62.8 35.7 89.2c8.6 9.7 12.8 22.5 11.8 35.5c-1.4 18.1-5.7 34.7-11.3 49.4c17-7.9 31.1-16.7 39.4-22.7zM21.2 431.9c1.8-2.7 3.5-5.4 5.1-8.1c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208s-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6c-15.1 6.6-32.3 12.6-50.1 16.1c-.8 .2-1.6 .3-2.4 .5c-4.4 .8-8.7 1.5-13.2 1.9c-.2 0-.5 .1-.7 .1c-5.1 .5-10.2 .8-15.3 .8c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c4.1-4.2 7.8-8.7 11.3-13.5c1.7-2.3 3.3-4.6 4.8-6.9c.1-.2 .2-.3 .3-.5z" />
                                      </svg>
                                  </span>
                              </a>
                              <a class="inline-flex items-center share-icon" href="#" data-post-id="${
                                post.id
                              }">
                                  <span class="ml-2">
                                      <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512">
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
                                  class="comment-input_${index} pt-2 pb-2 pl-3 w-full h-11 bg-slate-100 rounded-lg placeholder:text-slate-600 font-medium pr-20 " data-post-id="${postId}"
                                  type="text" placeholder="Write a comment" />
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
                        </div>
                            <!-- End comments row -->
                            <!-- More comments -->
                      </article>
                      <!-- End Card -->
                  </div>
              </div>
              <!-- End Wrapper-->
              `);
        // Append the share icon and handle click event
        postContainer.find(`#dropdown-${post.id}`).append(`
          <div class="cursor-pointer hover:bg-gray-200 p-2 w-20 rounded" onclick="sharePost(${post.id})">
            <a href="#">Share</a>
          </div>
        `);
        if (
          post.attributes.comments &&
          post.attributes.comments.data.length > 0
        ) {
          $.each(
            post.attributes.comments.data,
            function (commentIndex, comment) {
              //console.log(comment.attributes.comment)
              let commentPf = `<img class="rounded-full max-w-none w-10 h-10 object-cover"
                  src="https://cms.istad.co${comment.attributes.user.data.attributes.profile.data.attributes.url}" />`;
              let commentContent = `<p>${comment.attributes.comment}</p>`;
              let commentDate = `${formatDate(comment.attributes.publishedAt)}`;
              let commentUsername = `<a class="inline-block text-base font-bold mr-2" href="/src/pages/details.html?id=${comment.attributes.user.data.id}">${comment.attributes.user.data.attributes.username}</a>`;

              // Append each comment to the postContainer
              postContainer.find(`#commentsContainer_${index}`).append(`
                  <!-- Comment row -->
                  <div class="media flex pb-4">
                      <a class="mr-4" href="/src/pages/details.html?id=${comment.attributes.user.data.id}">
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
            }
          );
        }
        //append post and the comment part together
        $('.post').append(postContainer);

        //Create comment section
        $('.post').on('click', `#commentSend_${index}`, function () {
          let userId = localStorage.getItem('id');
          let commentText = $(`.comment-input_${index}`).val();

          console.log(
            'Clicked on comment input for postId:',
            postId,
            userId,
            commentText
          );

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
                  post: postId,
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
    },
    error: function (error) {
      console.error('Error fetching category data:', error);
    },
  });
}

// Function to handle the category click event
function onCategoryClick(categoryId) {
  updatePostSection(categoryId);
}

// Make AJAX request to get category data and populate the categories dynamically
$.ajax({
  url: 'https://cms.istad.co/api/sm-categories?populate=posts.photo,posts.user.profile',
  method: 'GET',
  dataType: 'json',
  success: function (data) {
    // Populate the categories dynamically
    data.data.forEach(function (category) {
      var html = `
              <div class="flex mx-4 gap-4">
                  <div class="mt-3">
                      <i class="fa-solid fa-circle-chevron-right text-blue-600 fa-xl"></i>
                  </div>
                  <div class="text-start">
                      <p class="font-bold" onclick="onCategoryClick(${category.id})">${category.attributes.name}</p>
                      <p class="text-base">${category.attributes.posts.data.length} posts</p>
                  </div>
              </div>`;
      $('#categorySection').append(html);
    });
  },
  error: function (error) {
    console.error('Error fetching data:', error);
  },
});

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
  }

  // Function to check if a user is already followed
  function isUserFollowed(userId) {
    // Check if the user ID is in the followers array
    return followers.includes(userId);
  }

  // Fetch and display user data initially
  fetchAndDisplayUserData();
});
