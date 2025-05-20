$(document).ready(function() {
    console.log("Main JavaScript file loaded.");

    window.cropper = null;

    window.initializeCropper = function(imageElement, options = {}) {
        if (window.cropper) {
            window.cropper.destroy();
        }
        window.cropper = new Cropper(imageElement, {
            aspectRatio: 1,
            viewMode: 2,
            responsive: true,
            autoCropArea: 0.8,
            ...options
        });
        imageElement.style.display = 'block';
    }
});