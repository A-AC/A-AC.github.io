document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("fileInput");
    const photo = document.getElementById("photo");
    const originalPh = document.getElementById("originalPhoto");
    const downloadLink = document.getElementById("downloadLink");
    const filterC = document.getElementById("filterC");
    const exposureS = document.getElementById("exposureS")

    let isFilterApplied = false;

    fileInput.addEventListener("change", async (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            photo.src = imageUrl;
            originalPh.src = imageUrl;
            photo.style.display = "block";
            downloadLink.style.display = "none";  // Hide download link initiall
            
            // Wait for the image to load befo
            // tre applying the filter
            photo.onload = async () => {
                    if (!isFilterApplied) {
                        console.log("Image loaded");
                        await render(originalPh, photo, exposureS.value, filterC.value);
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

    filterC.addEventListener("change", async (event)=>{
        await render(originalPh, photo, exposureS.value, filterC.value);
    });

    exposureS.addEventListener("change", async (event)=>{
        await render(originalPh, photo, exposureS.value, filterC.value);
    });
});




/**
 * Apply exposure filter to the uploaded image
 * @param {HTMLImageElement} imgElement 
 */
async function render(originaElement, imgElement, exposureV, filter) {
    console.log("Mod Exposure");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (imgElement.complete && imgElement.naturalWidth !== 0) {
        canvas.width = imgElement.naturalWidth;
        canvas.height = imgElement.naturalHeight;

        ctx.drawImage(originaElement, 0, 0, canvas.width, canvas.height);

        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let data = imageData.data;


        switch (filter){
            case "BN":
                for (let i = 0; i < data.length; i += 4) {
                    let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                    data[i] = data[i + 1] = data[i + 2] = avg;
                }
                break;

            case "red":
                for (let i = 0; i < data.length; i += 4) {
                    data[i + 1] = data[i + 2] = 0;
                }
                break;

            case "blue":
                for (let i = 0; i < data.length; i += 4) {
                    data[i] = data[i + 1] = 0;
                }
                break;

            case "green":
                for (let i = 0; i < data.length; i += 4) {
                    data[i] = data[i + 2] = 0;
                }
                break;

            case "filter1":
                for (let i = 0; i < data.length; i += 4) {
                    let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                    data[i] = data[i + 1] = data[i + 2] = avg;
                }
                break;

            default:
                data = imageData.data;
        }


        for (let i = 0; i < data.length; i += 4) {
            data[i] = data[i] - exposureV;
            data[i+1] = data[i+1] - exposureV;
            data[i+2] = data[i+2] - exposureV;
        }
        console.log(data);

        ctx.putImageData(imageData, 0, 0);

        // Convert canvas to Blob and create Object URL
        canvas.toBlob((blob) => {
            if (blob) {
                const blobUrl = URL.createObjectURL(blob);
                console.log("Blob URL:", blobUrl);

                // Set the processed image to the img element
                imgElement.src = blobUrl;

                // Update download link
                downloadLink.href = blobUrl;
                downloadLink.download = "filtered-image.jpg";  
                downloadLink.style.display = "inline-block";
            }
        }, "image/jpeg");
    }
}


/**
 * Apply exposure filter to the uploaded image
 * @param {HTMLImageElement} imgElement 

async function exposure(originaElement, imgElement, exposureV) {
    console.log("Mod Exposure");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (imgElement.complete && imgElement.naturalWidth !== 0) {
        canvas.width = imgElement.naturalWidth;
        canvas.height = imgElement.naturalHeight;

        ctx.drawImage(originaElement, 0, 0, canvas.width, canvas.height);

        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let data = imageData.data;

        // R G B A (0-255)
        console.log("FilterId: ", filter);
        switch (filter){
            case "BN":
                for (let i = 0; i < data.length; i += 4) {
                    let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                    data[i] = data[i + 1] = data[i + 2] = avg;
                }
                break;

            case "red":
                for (let i = 0; i < data.length; i += 4) {
                    data[i + 1] = data[i + 2] = 0;
                }
                break;

            case "blue":
                for (let i = 0; i < data.length; i += 4) {
                    data[i] = data[i + 1] = 0;
                }
                break;

            case "green":
                for (let i = 0; i < data.length; i += 4) {
                    data[i] = data[i + 2] = 0;
                }
                break;

            case "filter1":
                for (let i = 0; i < data.length; i += 4) {
                    let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                    data[i] = data[i + 1] = data[i + 2] = avg;
                }
                break;

            default:
                data = imageData.data;
        }

        for (let i = 0; i < data.length; i += 4) {
            data[i] = data[i] - exposureV;
            data[i+1] = data[i+1] - exposureV;
            data[i+2] = data[i+2] - exposureV;
        }
        console.log(data);

        ctx.putImageData(imageData, 0, 0);

        // Convert canvas to Blob and create Object URL
        canvas.toBlob((blob) => {
            if (blob) {
                const blobUrl = URL.createObjectURL(blob);
                console.log("Blob URL:", blobUrl);

                // Set the processed image to the img element
                imgElement.src = blobUrl;

                // Update download link
                downloadLink.href = blobUrl;
                downloadLink.download = "filtered-image.jpg";  
                downloadLink.style.display = "inline-block";
            }
        }, "image/jpeg");
    }
}

/**
 * Apply a grayscale filter to the uploaded image
 * @param {HTMLImageElement} imgElement 
 
async function applyFilter(originaElement, imgElement, filter) {
    console.log("Applying filter...");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (imgElement.complete && imgElement.naturalWidth !== 0) {
        canvas.width = imgElement.naturalWidth;
        canvas.height = imgElement.naturalHeight;

        ctx.drawImage(originaElement, 0, 0, canvas.width, canvas.height);

        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let data = imageData.data;

        // R G B A (0-255)
        console.log("FilterId: ", filter);
        switch (filter){
            case "BN":
                for (let i = 0; i < data.length; i += 4) {
                    let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                    data[i] = data[i + 1] = data[i + 2] = avg;
                }
                break;

            case "red":
                for (let i = 0; i < data.length; i += 4) {
                    data[i + 1] = data[i + 2] = 0;
                }
                break;

            case "blue":
                for (let i = 0; i < data.length; i += 4) {
                    data[i] = data[i + 1] = 0;
                }
                break;

            case "green":
                for (let i = 0; i < data.length; i += 4) {
                    data[i] = data[i + 2] = 0;
                }
                break;

            case "filter1":
                for (let i = 0; i < data.length; i += 4) {
                    let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                    data[i] = data[i + 1] = data[i + 2] = avg;
                }
                break;

            default:
                data = imageData.data;

            console.log(data);
            console.log(imageData);
        }
        ctx.putImageData(imageData, 0, 0);

        // Convert canvas to Blob and create Object URL
        canvas.toBlob((blob) => {
            if (blob) {
                const blobUrl = URL.createObjectURL(blob);
                console.log("Blob URL:", blobUrl);

                // Set the processed image to the img element
                imgElement.src = blobUrl;

                // Update download link
                downloadLink.href = blobUrl;
                downloadLink.download = "filtered-image.jpg";  
                downloadLink.style.display = "inline-block";
            }
        }, "image/jpeg");
    }
}
    */