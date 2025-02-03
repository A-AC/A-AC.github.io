document.addEventListener("DOMContentLoaded", async () => {
    const fileInput = document.getElementById("fileInput");
    const photo = document.getElementById("photo");
    const downloadLink = document.getElementById("downloadLink");
    
    let isFilterApplied = false;

    fileInput.addEventListener("change", async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const fileType = file.type.toLowerCase();  // Use toLowerCase() for a more reliable check

        if (fileType === "image/jpeg") {
            handleJPEG(file);
        } else if (fileType === "image/heif" || fileType === "image/heic" || fileType === "image/x-heif") {
            handleHEIF(file);
        } else {
            alert("Unsupported file type. Please upload a JPEG or HEIF/HEIC image.");
        }
    });

    function handleJPEG(file) {
        const imageUrl = URL.createObjectURL(file);
        photo.src = imageUrl;
        photo.style.display = "block";
        downloadLink.style.display = "none";

        photo.onload = async () => {
            if (!isFilterApplied) {
                console.log("JPEG Image loaded");
                await applyFilter(photo);
                isFilterApplied = true;
            }
        };

        photo.onerror = () => {
            alert("Error loading JPEG image!");
        };
    }

    async function handleHEIF(file) {
        const reader = new FileReader();
        reader.onload = async function (e) {
            const libheif = await window.libheif();
            const decoder = new libheif.HeifDecoder();
            
            try {
                const imageData = e.target.result;
                const decodedImages = decoder.decode(imageData);
                const image = decodedImages[0]; // Use the first image if multiple exist
                
                // Convert HEIF to JPEG blob
                const blob = await new Promise((resolve) => {
                    image.display({ type: "image/jpeg" }, (data) => {
                        resolve(new Blob([data], { type: "image/jpeg" }));
                    });
                });

                const imageUrl = URL.createObjectURL(blob);
                
                // Convert blob to ImageBitmap for better rendering
                const bitmap = await createImageBitmap(blob);
                
                // Draw the converted HEIF image on a canvas
                const canvas = document.createElement("canvas");
                canvas.width = bitmap.width;
                canvas.height = bitmap.height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(bitmap, 0, 0);

                // Set the HEIF image URL for display
                photo.src = canvas.toDataURL("image/jpeg");
                photo.style.display = "block";

                photo.onload = async () => {
                    if (!isFilterApplied) {
                        console.log("HEIF Image loaded");
                        await applyFilter(photo);
                        isFilterApplied = true;
                    }
                };
            } catch (error) {
                console.error("Error decoding HEIF image:", error);
                alert("Error processing HEIF image.");
            }
        };

        reader.readAsArrayBuffer(file);
    }
});

/**
 * Apply a grayscale filter to the uploaded image
 * @param {HTMLImageElement} imgElement 
 */
async function applyFilter(imgElement) {
    console.log("Applying filter...");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (imgElement.complete && imgElement.naturalWidth !== 0) {
        canvas.width = imgElement.naturalWidth;
        canvas.height = imgElement.naturalHeight;

        ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);

        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = data[i + 1] = data[i + 2] = avg;
        }

        ctx.putImageData(imageData, 0, 0);

        const processedImageUrl = canvas.toDataURL("image/jpeg");
        imgElement.src = processedImageUrl;

        downloadLink.style.display = "inline-block";
    } else {
        console.log("Image is not loaded properly or not ready yet");
    }
}
