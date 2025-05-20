$(document).ready(function() {
    const croppers = {
        1: null,
        2: null,
        3: null
    };

    for (let i = 1; i <= 3; i++) {
        const imageUpload = document.getElementById(`imageUpload${i}`);
        const imageToCrop = document.getElementById(`imageToCrop${i}`);

        if (imageUpload && imageToCrop) {
            imageUpload.addEventListener('change', function(event) {
                const files = event.target.files;
                if (files && files.length > 0) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        if (croppers[i]) {
                            croppers[i].destroy();
                        }

                        imageToCrop.src = e.target.result;
                        imageToCrop.style.display = 'block';

                        croppers[i] = new Cropper(imageToCrop, {
                            aspectRatio: 1,
                            viewMode: 3,
                            dragMode: 'move',
                            responsive: true,
                            autoCropArea: 0.8,
                            restore: false,
                            guides: true,
                            center: true,
                            highlight: false,
                            cropBoxMovable: true,
                            cropBoxResizable: true,
                            toggleDragModeOnDblclick: false
                        });
                    };
                    reader.readAsDataURL(files[0]);
                }
            });
        }
    }

    const previewButton = document.getElementById('previewButton');
    if (previewButton) {
        previewButton.addEventListener('click', async function() {
            const recaptchaToken = grecaptcha.getResponse();
            if (!recaptchaToken) {
                alert('Please complete the reCAPTCHA verification');
                return;
            }

            const croppedImages = {};
            
            for (let i = 1; i <= 3; i++) {
                if (croppers[i]) {
                    const croppedCanvas = croppers[i].getCroppedCanvas();
                    if (croppedCanvas) {
                        croppedImages[`image${i}`] = croppedCanvas.toDataURL();
                    }
                }
            }

            const textLine1 = $('#textLine1').val();

            try {
                const response = await fetch('https://8454-80-189-150-81.ngrok-free.app/upload', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${recaptchaToken}`
                    },
                    body: JSON.stringify({
                        images: croppedImages,
                        text: textLine1
                    })
                });

                if (!response.ok) {
                    throw new Error('Upload failed');
                }

                const result = await response.json();
                console.log('Upload successful:', result);
                alert('Product customization previewed!');
            } catch (error) {
                console.error('Upload error:', error);
                alert('Failed to upload images. Please try again.');
            }

            grecaptcha.reset();
        });
    }
}); 