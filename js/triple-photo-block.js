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
                            viewMode: 2,
                            dragMode: 'move',
                            responsive: true,
                            autoCropArea: 0.8,
                            restore: false,
                            guides: true,
                            center: true,
                            highlight: false,
                            cropBoxMovable: true,
                            cropBoxResizable: true,
                            toggleDragModeOnDblclick: false,
                            imageFit: 'contain'
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
            try {
                const recaptchaToken = await grecaptcha.execute('6LeVpEErAAAAADIsGgKwZu9M4Chq8z6f703_1qKB', {action: 'upload'});
                
                const croppedImages = {};
                
                for (let i = 1; i <= 3; i++) {
                    if (croppers[i]) {
                        const croppedCanvas = croppers[i].getCroppedCanvas();
                        if (croppedCanvas) {
                            croppedImages[`image${i}`] = croppedCanvas.toDataURL();
                        }
                    }
                }

                const textLines = {};
                $("input[id^='textLine']").each(function() {
                    textLines[$(this).attr('id')] = $(this).val();
                });

                const response = await fetch('https://6fed-80-189-150-81.ngrok-free.app/upload', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${recaptchaToken}`
                    },
                    body: JSON.stringify({
                        images: croppedImages,
                        textLines: textLines
                    })
                });

                if (!response.ok) {
                    throw new Error('Upload failed');
                }

                const result = await response.json();
                console.log('Upload successful:', result);
                window.location.href = `thankyou.html?code=${encodeURIComponent(result.code)}`;
            } catch (error) {
                console.error('Upload error:', error);
                alert('Failed to upload images. Please try again.');
            }
        });
    }
}); 