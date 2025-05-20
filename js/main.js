$(document).ready(function() {
    console.log("Main JavaScript file loaded.");

    // --- Common Cropper Initialization --- 
    window.cropper = null; // Made global
    // Product-specific image and upload elements will be handled in their respective files

    window.initializeCropper = function(imageElement, options = {}) { // Made global
        if (window.cropper) {
            window.cropper.destroy();
        }
        window.cropper = new Cropper(imageElement, {
            aspectRatio: 1, // Default aspect ratio, can be overridden by product page
            viewMode: 1,
            responsive: true,
            autoCropArea: 0.8,
            ...options // Spread any product-specific options
        });
        imageElement.style.display = 'block';
    }

    // Product-specific logic has been moved to js/product1.js and js/product2.js
    // Ensure those files are included in the respective HTML pages after main.js
});