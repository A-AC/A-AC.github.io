document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("fileInput");
    const photo = document.getElementById("photo");
    const originalPh = document.getElementById("originalPhoto");
    const downloadLink = document.getElementById("downloadLink");
    const filterC = document.getElementById("filterC");
    const exposureS = document.getElementById("exposureS")
    const noiseIntenseS = document.getElementById("noiseIntenseS")
    const highlightsS = document.getElementById("highlightsS")
    const shadowsS = document.getElementById("shadowsS")

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
        await render(originalPh, photo, exposureS.value, filterC.value, noiseIntenseS.value, highlightsS.value, shadowsS.value);
    });

    exposureS.addEventListener("change", async (event)=>{
        await render(originalPh, photo, exposureS.value, filterC.value, noiseIntenseS.value, highlightsS.value, shadowsS.value);
    });

    noiseIntenseS.addEventListener("change", async (event)=>{
        await render(originalPh, photo, exposureS.value, filterC.value, noiseIntenseS.value, highlightsS.value, shadowsS.value);
    });

    highlightsS.addEventListener("change", async (event)=>{
        await render(originalPh, photo, exposureS.value, filterC.value, noiseIntenseS.value, highlightsS.value, shadowsS.value);
    });

    shadowsS.addEventListener("change", async (event)=>{
        await render(originalPh, photo, exposureS.value, filterC.value, noiseIntenseS.value, highlightsS.value, shadowsS.value);
    });
});




/**
 * Apply exposure filter to the uploaded image
 * @param {HTMLImageElement} imgElement 
 */
async function render(originaElement, imgElement, exposureV, filter, noiseIntenseV, highlightsV, shadowsV) {
    console.log("Mod Exposure");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (imgElement.complete && imgElement.naturalWidth !== 0) {
        canvas.width = imgElement.naturalWidth;
        canvas.height = imgElement.naturalHeight;

        ctx.drawImage(originaElement, 0, 0, canvas.width, canvas.height);

        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let data = imageData.data;

        // Filters
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

            case "noise":
                noiseIntenseV = 100;
                noiseIntenseS.value = 100;
                exposureV = 10;
                exposureS.value = 10;
                break;

            case "crazy":
                for (let i = 0; i < data.length; i += 4) {
                    if (data[i] > data[i+1] && data[i] > data[i+2]){
                        data[i + 1] = data[i + 2] = 0;
                    } else if (data[i+1] > data[i] && data[i+1] > data[i+2]){
                        data[i] = data[i + 2] = 0;
                    } else if (data[i+2] > data[i] && data[i+2] > data[i+1]){
                        data[i] = data[i + 1] = 0;
                    }
                }
                break;

            default:
                data = imageData.data;
        }

        // render
        for (let i = 0; i < data.length; i += 4) {
            let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = data[i] - (-exposureV - (Math.floor(Math.random() * noiseIntenseS.value) - noiseIntenseS.value/2));
            data[i+1] = data[i+1] - (-exposureV - (Math.floor(Math.random() * noiseIntenseS.value) - noiseIntenseS.value/2));
            data[i+2] = data[i+2] - (-exposureV - (Math.floor(Math.random() * noiseIntenseS.value) - noiseIntenseS.value/2));
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