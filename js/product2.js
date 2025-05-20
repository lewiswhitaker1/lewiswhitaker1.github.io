$(document).ready(function() {
    // --- Product 2 Specific Logic --- 
    const imageToCropProduct2 = document.getElementById('imageToCropP2');
    const imageUploadProduct2 = document.getElementById('imageUploadP2');

    if (imageUploadProduct2 && imageToCropProduct2) {
        imageUploadProduct2.addEventListener('change', function(event) {
            const files = event.target.files;
            if (files && files.length > 0) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imageToCropProduct2.src = e.target.result;
                    // Ensure window.initializeCropper is available from main.js
                    if (window.initializeCropper) {
                        window.initializeCropper(imageToCropProduct2, { aspectRatio: 1 / 1 }); 
                    }
                };
                reader.readAsDataURL(files[0]);
            }
        });

        const previewButtonProduct2 = document.getElementById('previewButtonP2');
        if (previewButtonProduct2) {
            previewButtonProduct2.addEventListener('click', function() {
                // Ensure window.cropper is available from main.js
                if (window.cropper) {
                    const croppedCanvas = window.cropper.getCroppedCanvas();
                    console.log("Product 2 Cropped Image Data URL:", croppedCanvas.toDataURL());
                    alert("Product 2 customization previewed! Check the console for image data.");
                }
                const textLine1P2 = $('#textLine1P2').val();
                const textLine2P2 = $('#textLine2P2').val();
                console.log("Product 2 Text Line 1:", textLine1P2);
                console.log("Product 2 Text Line 2:", textLine2P2);
            });
        }
    }
});