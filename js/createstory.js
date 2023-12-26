'use strict';

let inputFile = $('#file_input');

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

function previewStoryImage(input) {
  const preview = document.getElementById('preview');
  const labelPreview = document.getElementById('labelPreview');

  if (input.files && input.files[0]) {
      const reader = new FileReader();

      reader.onload = function (e) {
          preview.src = e.target.result;
          preview.classList.remove('hidden'); // Show the preview image
          labelPreview.classList.remove('hidden')
      };

      reader.readAsDataURL(input.files[0]);
  }
}

async function createStory() {
  const userId = localStorage.getItem('id');
  const fileInput = $('#file_input')[0]; // Assuming you have a single file input
  const files = fileInput.files;
  const imageId = await uploadImage(files);

  let story = {
    url: 'https://cms.istad.co/api/sm-stories',
    method: 'POST',
    timeout: 0,
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      data: {
        media: imageId,
        user: userId,
      },
    }),
  };
  // Your previous code...

  $.ajax(story)
    .done(function (response) {
      // Check if the response indicates a successful creation (you may need to adjust this based on your API)
      if (response && response.data && response.data.id) {
        // Success Show toastr notification
        toastr.success('Story created successfully!');

        // Clear form fields
        $('#file_input').val('');
      } else {
        // Handle other cases or errors if needed
        alert('Failed to create post. Check the console for details.');
      }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      console('Error creating post:', textStatus, errorThrown);

      // Show toastr notification for failure
      alert('Failed to create post. Check the console for details.');
    });
}
