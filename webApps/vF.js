document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("fileInput");
    const photo = document.getElementById("photo");
    const downloadLink = document.getElementById("downloadLink");

    let isFilterApplied = false;

    fileInput.addEventListener("change", async (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            photo.src = imageUrl;
            photo.style.display = "block";
            downloadLink.style.display = "none";  // Hide download link initially


            // Wait for the image to load before applying the filter
            photo.onload = async () => {
                if (!isFilterApplied) {
                    console.log("Image loaded");
                    await applyFilter(photo);
                    isFilterApplied = true;  // Mark the filter as applied
                }
            };

            // Handle errors in loading image
            photo.onerror = () => {
                alert("Error loading image!");
                console.log("Error loading image");
            };
        }
    });
});

/**
 * Apply a grayscale filter to the uploaded image
 * @param {HTMLImageElement} imgElement 
 */
async function applyFilter(imgElement) {
    console.log("Applying filter...");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Ensure the image is fully loaded and has dimensions
    if (imgElement.complete && imgElement.naturalWidth !== 0) {
        canvas.width = imgElement.naturalWidth;  // Use natural dimensions of the image
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
        const processedImageUrl = canvas.toDataURL("img.jpg");
        console.log("Processed image URL:", processedImageUrl);

        // Set the processed image to the img element
        imgElement.src = processedImageUrl;

        // Enable the download link
        downloadLink.href = processedImageUrl;
        downloadLink.style.display = "inline-block";
    } else {
        console.log("Image is not loaded properly or not ready yet");
        imgElement.onload = async () => {
            await applyFilter(imgElement);
        };
    }
}