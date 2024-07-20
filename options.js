document.addEventListener('DOMContentLoaded', function () {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const downloadLink = document.getElementById('download');
    const captureButton = document.getElementById('capture');

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(error => {
            console.error('Error accessing camera:', error);
        });

    captureButton.addEventListener('click', () => {
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL('image/png');

        downloadLink.href = dataURL;
        downloadLink.download = 'captured_image.png';
        downloadLink.style.display = 'block';
        downloadLink.click();
    });
});
