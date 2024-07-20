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
