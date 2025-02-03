document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("fileInput");
    const photo = document.getElementById("photo");
    const downloadLink = document.getElementById("downloadLink");

    fileInput.addEventListener("change", async (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            photo.src = imageUrl;
            photo.style.display = "block";
            downloadLink.style.display = "none";  // Hide download link initially

            // Set the download link file name based on the original file type
            const fileExtension = file.name.split('.').pop().toLowerCase();
            const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, ""); // Remove extension

            // Wait for the image to load before applying the filter
            photo.onload = async () => {
                console.log("Image loaded");
                await applyFilter(photo, fileExtension, fileNameWithoutExtension);
            };

            // Handle errors in loading image
            photo.onerror = () => {
                console.log("Error loading image");
            };
        }
    });
});

async function applyFilter(imgElement, fileExtension, fileNameWithoutExtension) {
    console.log("Applying filter...");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Ensure the image is fully loaded and has dimensions
    if (imgElement.complete && imgElement.naturalWidth !== 0) {
        canvas.width = imgElement.naturalWidth;
        canvas.height = imgElement.naturalHeight;
        console.log(`Canvas dimensions: ${canvas.width} x ${canvas.height}`);

        // Draw the image onto the canvas
        ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);

        // Get the image data from the canvas
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let data = imageData.data;

        // Apply grayscale filter
        for (let i = 0; i < data.length; i += 4) {
            let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = data[i + 1] = data[i + 2] = avg;
        }

        // Put the updated image data back onto the canvas
        ctx.putImageData(imageData, 0, 0);

        // Convert canvas content to JPG format
        const processedImageUrl = canvas.toDataURL();
        console.log("Processed image URL:", processedImageUrl);

        // Set the processed image to the img element
        imgElement.src = processedImageUrl;

        // Set the correct download link based on file type
        const downloadExtension = fileExtension === "heif" || fileExtension === "heic" ? "heif" : "jpg";
        downloadLink.href = processedImageUrl;
        downloadLink.download = `${fileNameWithoutExtension}.${downloadExtension}`;
        downloadLink.style.display = "inline-block";
    } else {
        console.log("Image is not loaded properly or not ready yet");
        imgElement.onload = async () => {
            await applyFilter(imgElement);
        };
    }
}
