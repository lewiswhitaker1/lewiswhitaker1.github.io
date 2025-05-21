document.addEventListener('DOMContentLoaded', function() {
    let cropper = null;
    const imageUpload = document.getElementById('imageUpload1');
    const imageToCrop = document.getElementById('imageToCrop1');
    const shapeSelect = document.getElementById('shapeSelect');
    const previewButton = document.getElementById('previewButton');

    const shapeAspectRatios = {
        'small-square': 61/54,
        'large-square': 1,
        'small-rectangle': 92/54,
        'large-rectangle': 124/92,
        'small-heart': 84/74,
        'large-heart': 1
    };

    shapeSelect.addEventListener('change', function() {
        if (cropper) {
            const newAspectRatio = shapeAspectRatios[this.value];
            cropper.setAspectRatio(newAspectRatio);
        }
    });

    imageUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imageToCrop.src = e.target.result;
                imageToCrop.style.display = 'block';

                if (cropper) {
                    cropper.destroy();
                }

                cropper = new Cropper(imageToCrop, {
                    aspectRatio: shapeAspectRatios[shapeSelect.value],
                    viewMode: 1,
                    dragMode: 'move',
                    autoCropArea: 1,
                    restore: false,
                    guides: true,
                    center: true,
                    highlight: false,
                    cropBoxMovable: true,
                    cropBoxResizable: true,
                    toggleDragModeOnDblclick: false
                });
            };
            reader.readAsDataURL(file);
        }
    });

    previewButton.addEventListener('click', async function() {
        try {
            const recaptchaToken = await grecaptcha.execute('6LeVpEErAAAAADIsGgKwZu9M4Chq8z6f703_1qKB', {action: 'upload'});
            
            if (cropper) {
                const croppedCanvas = cropper.getCroppedCanvas();
                if (croppedCanvas) {
                    const formData = new FormData();
                    
                    const blob = await new Promise(resolve => croppedCanvas.toBlob(resolve, 'image/jpeg', 0.95));
                    formData.append('image1', blob, 'image1.jpg');
                    
                    formData.append('shape', shapeSelect.value);

                    const response = await fetch('https://6fed-80-189-150-81.ngrok-free.app/upload', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${recaptchaToken}`
                        },
                        body: formData
                    });

                    if (!response.ok) {
                        throw new Error('Upload failed');
                    }

                    const result = await response.json();
                    console.log('Upload successful:', result);
                    window.location.href = `thankyou.html?code=${encodeURIComponent(result.code)}`;
                }
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload image. Please try again.');
        }
    });
});