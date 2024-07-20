chrome.storage.local.get(['capture'], function (result) {
    if (result.capture) {
        captureImage();
        chrome.storage.local.set({ capture: false }); // Reset the flag
    }
});

function captureImage() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            // Create a video element to capture the stream
            let video = document.createElement('video');
            video.srcObject = stream;
            video.play();

            // Capture a frame from the video
            video.onloadedmetadata = () => {
                let canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                let ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                let imgData = canvas.toDataURL('image/png');

                // Log the captured image data (for demonstration purposes)
                console.log(imgData);
                // upload(imgData);


                // Stop the stream
                stream.getTracks().forEach(track => track.stop());
            };
        })
        .catch((error) => {
            console.error('Error accessing camera:', error.message);

            // Additional error handling can be implemented here
            if (error.name === 'NotAllowedError') {
                alert('Camera access was denied. Please allow camera access.');
            } else if (error.name === 'NotFoundError') {
                alert('No camera found. Please connect a camera.');
            } else {
                alert('An error occurred while accessing the camera: ' + error.message);
            }
        });
}





// function upload(imageData) {
//     const cloudName = 'your_cloud_name'; // Replace with your Cloudinary cloud name
//     const uploadPreset = 'your_upload_preset'; // Replace with your upload preset

//     // Remove the data URL prefix to get just the base64-encoded string
//     const base64Image = imageData.split(',')[1];

//     // Create a form data object
//     const formData = new FormData();
//     formData.append('file', `data:image/png;base64,${base64Image}`);
//     formData.append('upload_preset', uploadPreset);

//     // Make the request to Cloudinary
//     fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
//         method: 'POST',
//         body: formData
//     })
//         .then(response => response.json())
//         .then(data => {
//             console.log('Upload successful:', data);
//         })
//         .catch(error => {
//             console.error('Error uploading image:', error);
//         });
// }