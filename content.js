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

                // Upload the captured image data to Cloudinary
                uploadToCloudinary(imgData);

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

function uploadToCloudinary(imageData) {
    const cloudName = 'your_cloud_name'; // Replace with your Cloudinary cloud name
    const apiKey = 'your_api_key'; // Replace with your Cloudinary API key
    const timestamp = Math.floor(Date.now() / 1000); // Current timestamp
    const apiSecret = 'your_api_secret'; // Replace with your Cloudinary API secret
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const paramsToSign = {
        timestamp: timestamp,
    };

    // Create a signature using the API secret
    const signature = createSignature(paramsToSign, apiSecret);

    // Form data to send in the request
    const formData = new FormData();
    formData.append('file', imageData);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);

    // Make the request to Cloudinary
    fetch(uploadUrl, {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            console.log('Upload successful:', data);
        })
        .catch(error => {
            console.error('Error uploading image:', error);
        });
}

function createSignature(params, apiSecret) {
    const paramsString = Object.keys(params)
        .sort()
        .map(key => `${key}=${params[key]}`)
        .join('&');

    return CryptoJS.SHA1(paramsString + apiSecret).toString();
}
