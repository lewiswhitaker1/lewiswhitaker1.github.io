$(document).ready(function() {
    const imageToCropProduct1 = document.getElementById('imageToCrop');
    const imageUploadProduct1 = document.getElementById('imageUpload');

    if (imageUploadProduct1 && imageToCropProduct1) {
        imageUploadProduct1.addEventListener('change', function(event) {
            const files = event.target.files;
            if (files && files.length > 0) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imageToCropProduct1.src = e.target.result;
                    if (window.initializeCropper) {
                        window.initializeCropper(imageToCropProduct1, { aspectRatio: 1 / 1 }); 
                    }
                };
                reader.readAsDataURL(files[0]);
            }
        });

        const previewButtonProduct1 = document.getElementById('previewButton');
        if (previewButtonProduct1) {
            previewButtonProduct1.addEventListener('click', function() {
                if (window.cropper) {
                    const croppedCanvas = window.cropper.getCroppedCanvas();
                    console.log("Product 1 Cropped Image Data URL:", croppedCanvas.toDataURL());
                    alert("Product 1 customization previewed! Check the console for image data.");
                }
                const textLine1 = $('#textLine1').val();
                console.log("Product 1 Text Line 1:", textLine1);
            });
        }
    }
});