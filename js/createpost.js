'use strict';

$(document).ready(function () {
  // Fetch categories from the API
  $.ajax({
    url: 'https://cms.istad.co/api/sm-categories',
    method: 'GET',
    dataType: 'json',
    success: function (data) {
      // Log the name of the first category

      // Populate the dropdown with categories
      var categoriesDropdown = $('#categories');
      $.each(data.data, function (index, category) {
        categoriesDropdown.append(
          '<option value="' +
            category.id +
            '">' +
            category.attributes.name +
            '</option>'
        );
      });
    },
    error: function (error) {
      console.error('Error fetching categories:', error);
    },
  });
});

let selectedCategoryId; // Declare the variable outside the event handler

$('#categories').on('change', function () {
  // Get the selected category ID
  selectedCategoryId = $(this).val();
});

function previewImage() {
  const fileInput = document.getElementById('file');
  const preview = document.getElementById('preview');
  const labelPreview = document.getElementById('labelPreview');

  if (fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();

    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.classList.remove('hidden'); // Show the preview image
      labelPreview.classList.remove('hidden');
    };

    reader.readAsDataURL(fileInput.files[0]);
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

async function createPost() {
  // Check if the user is authenticated (you may need to adjust this based on your authentication mechanism)
  const responseJwt = localStorage.getItem('token');

  if (!responseJwt) {
    // If the user is not authenticated, show toastr notification and return
    toastr.warning('Please log in to create a post.');
    return;
  }

  // Get values from input fields
  const title = $('#title').val();
  const category = selectedCategoryId;
  const fileInput = $('#file')[0]; // Assuming you have a single file input
  const files = fileInput.files;
  const description = $('#message').val();
  const userId = localStorage.getItem('id');
  const imageId = await uploadImage(files);

  let post = {
    url: 'https://cms.istad.co/api/sm-posts',
    method: 'POST',
    timeout: 0,
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      data: {
        title: title,
        detail: description,
        photo: imageId[0].id,
        user: userId,
        category: category,
      },
    }),
  };

  $.ajax(post)
    .done(function (response) {
      // Check if the response indicates a successful creation (you may need to adjust this based on your API)
      if (response && response.data && response.data.id) {
        // Success! Show toastr notification
        toastr.success('Post created successfully!');

        // Wait for a short delay (e.g., 2 seconds) before reloading the page
      setTimeout(function () {
        // Once the create action is completed, you can update the UI accordingly
        location.reload();
        // You can perform additional actions after a successful update
      }, 2000); // 2000 milliseconds (2 seconds)

        // Clear preview image
        clearPreviewImage();

        // Clear form fields
        $('#title').val('');
        $('#categories').val('');
        $('#file').val('');
        $('#message').val('');

        // Close the modal after successfully creating the post
        document.getElementById('story-modal').classList.add('hidden');

        // If you have other form fields, add them to the clearing process as well
      } else {
        // Handle other cases or errors if needed
        toastr.error('Failed to create post. Check the console for details.');
      }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      console.error('Error creating post:', textStatus, errorThrown);

      // Show toastr notification for failure
      toastr.error('Failed to create post. Check the console for details.');
    });
}

function clearPreviewImage() {
  // Reset the preview image
  const preview = document.getElementById('preview');
  preview.src = '';
  preview.classList.add('hidden');

  // Optionally, reset the file input (if you want to clear the selected file)
  const fileInput = document.getElementById('file');
  fileInput.value = '';
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
