document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    
    if (!file) return;

    const reader = new FileReader();
    
    reader.onload = function(e) {
        const arrayBuffer = e.target.result;
        const blob = new Blob([arrayBuffer]);

        const imgElement = document.getElementById('photo');
        const downloadLink = document.getElementById('downloadLink');

        // Check if the image is a HEIF/HEIC image
        if (file.type === 'image/heif' || file.type === 'image/heic') {
            // Use libheif-js to decode HEIF/HEIC
            libheif.decode(arrayBuffer).then(function(decodedImage) {
                // Create a canvas to render the decoded image
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = decodedImage.width;
                canvas.height = decodedImage.height;
                
                // Draw the decoded image onto the canvas
                ctx.putImageData(decodedImage, 0, 0);

                // Convert canvas to data URL and set as image source
                imgElement.src = canvas.toDataURL();
                imgElement.style.display = 'block';

                // Set the download link
                downloadLink.href = canvas.toDataURL();
                downloadLink.style.display = 'inline';
                downloadLink.innerHTML = 'Download Image';
            }).catch(function(error) {
                console.error("Error decoding HEIF/HEIC image: ", error);
            });
        } else {
            // If it's not a HEIF/HEIC, display it directly as a JPEG/JPG image
            imgElement.src = URL.createObjectURL(blob);
            imgElement.style.display = 'block';

            // Set the download link for JPEG/JPG
            downloadLink.href = imgElement.src;
            downloadLink.style.display = 'inline';
            downloadLink.innerHTML = 'Download Image';
        }
    };
    
    reader.readAsArrayBuffer(file);
});
