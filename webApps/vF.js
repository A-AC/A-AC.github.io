import _ from 'lodash'

document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("fileInput");
    const photo = document.getElementById("photo");
    const originalPh = document.getElementById("originalPhoto");
    const downloadLink = document.getElementById("downloadLink");
    const filterC = document.getElementById("filterC");

    const exposureS = document.getElementById("exposureS");
    const noiseIntenseS = document.getElementById("noiseIntenseS");
    const highlightsS = document.getElementById("highlightsS");
    const shadowsS = document.getElementById("shadowsS");

    const exposureSContainer = document.getElementById("slidecontainerExposure");
    const noiseIntenseSContainer = document.getElementById("slidecontainerNoiseIntense");
    const highlightsSContainer = document.getElementById("slidecontainerHighlights");
    const shadowsSContainer = document.getElementById("slidecontainerShadows");

    const exposureC = document.getElementById("exposureC");
    const noiseIntenseC = document.getElementById("noiseIntenseC");
    const highlightsC = document.getElementById("highlightC");
    const shadowsC = document.getElementById("shadowC");

    const exposureSV = document.getElementById("exposureSV");
    const noiseIntenseSV = document.getElementById("noiseIntenseSV");
    const highlightsSV = document.getElementById("highlightsSV");
    const shadowsSV = document.getElementById("shadowsSV");


    exposureSV.innerHTML = exposureS.value;
    noiseIntenseSV.innerHTML = noiseIntenseS.value;
    highlightsSV.innerHTML = highlightsS.value;
    shadowsSV.innerHTML = shadowsS.value;


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
                        await render(originalPh, photo, exposureS.value, filterC.value, noiseIntenseS.value, highlightsS.value, shadowsS.value);
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
        exposureSV.innerHTML = exposureS.value;

        await render(originalPh, photo, exposureS.value, filterC.value, noiseIntenseS.value, highlightsS.value, shadowsS.value);
    });

    noiseIntenseS.addEventListener("change", async (event)=>{
        noiseIntenseSV.innerHTML = noiseIntenseS.value;

        await render(originalPh, photo, exposureS.value, filterC.value, noiseIntenseS.value, highlightsS.value, shadowsS.value);
    });

    highlightsS.addEventListener("change", async (event)=>{
        highlightsSV.innerHTML = highlightsS.value;

        await render(originalPh, photo, exposureS.value, filterC.value, noiseIntenseS.value, highlightsS.value, shadowsS.value);
    });

    shadowsS.addEventListener("change", async (event)=>{
        shadowsSV.innerHTML = shadowsS.value;

        await render(originalPh, photo, exposureS.value, filterC.value, noiseIntenseS.value, highlightsS.value, shadowsS.value);
    });

    exposureC.addEventListener('change', function() {
        if (this.checked) {
            console.log("Exposure Checkbox is checked..");
            noiseIntenseC.checked = false;
            highlightsC.checked = false;
            shadowsC.checked = false;

            exposureSContainer.style.display = "inline-block";
            noiseIntenseSContainer.style.display = "none";
            highlightsSContainer.style.display = "none";
            shadowsSContainer.style.display = "none";
        } else {
            exposureSContainer.style.display = "none";
        }
    });

    noiseIntenseC.addEventListener('change', function() {
        if (this.checked) {
            console.log("Noise Intense Checkbox is checked..");
            exposureC.checked = false;
            highlightsC.checked = false;
            shadowsC.checked = false;

            exposureSContainer.style.display = "none";
            noiseIntenseSContainer.style.display = "inline-block";
            highlightsSContainer.style.display = "none";
            shadowsSContainer.style.display = "none";
        } else {
            noiseIntenseSContainer.style.display = "none";
        }
    });

    highlightsC.addEventListener('change', function() {
        if (this.checked) {
            console.log("Highlights Checkbox is checked..");
            exposureC.checked = false;
            noiseIntenseC.checked = false;
            shadowsC.checked = false;

            exposureSContainer.style.display = "none";
            noiseIntenseSContainer.style.display = "none";
            highlightsSContainer.style.display = "inline-block";
            shadowsSContainer.style.display = "none";
        } else {
            highlightsSContainer.style.display = "none";
        }
    });

    shadowsC.addEventListener('change', function() {
        if (this.checked) {
            console.log("Shadows Checkbox is checked..");
            exposureC.checked = false;
            noiseIntenseC.checked = false;
            highlightsC.checked = false;

            exposureSContainer.style.display = "none";
            noiseIntenseSContainer.style.display = "none";
            highlightsSContainer.style.display = "none";
            shadowsSContainer.style.display = "inline-block";
        } else {
            shadowsSContainer.style.display = "none";
        }
    });
});



/**
 * Apply exposure filter to the uploaded image
 * @param {HTMLImageElement} imgElement 
 */
async function render(originaElement, imgElement, exposureV, filter, noiseIntenseV, highlightsV, shadowsV) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (imgElement.complete && imgElement.naturalWidth !== 0) {
        canvas.width = imgElement.naturalWidth;
        canvas.height = imgElement.naturalHeight;

        ctx.drawImage(originaElement, 0, 0, canvas.width, canvas.height);

        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let data = imageData.data;

        if (window.Worker) {

            data = await renderWithWorkers(data);

            /*const myWorker1 = new Worker("renderWorker.js");
            const myWorker2 = new Worker("renderWorker.js");
            let [firstHalf, secondHalf] = splitUint8ClampedArray(data, data.length / 2);
            var arr1;
            var arr2;

            myWorker1.postMessage(firstHalf);
            console.log("Message posted to renderworker1");
            
            myWorker2.postMessage(secondHalf);
            console.log("Message posted to renderworker2");

            myWorker1.onmessage = (e) => {
                console.log(e.data)
                arr1 = e.data;
                console.log("Message received from renderworker1");
            };

            myWorker2.onmessage = (e) => {
                arr2 = e.data;
                console.log("Message received from renderworker2");
            };

            data = joinUint8ClampedArrays(arr1, arr2);*/

        } else {
            console.log("Your browser doesn't support web workers.");
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

                data[i] = data[i] - (-exposureV - (Math.floor(Math.random() * noiseIntenseV) - noiseIntenseV/2) - highlightsCurve(avg, highlightsV) - shadowCurve(avg, shadowsV));
                data[i+1] = data[i+1] - (-exposureV - (Math.floor(Math.random() * noiseIntenseV) - noiseIntenseV/2) - highlightsCurve(avg, highlightsV) - shadowCurve(avg, shadowsV));
                data[i+2] = data[i+2] - (-exposureV - (Math.floor(Math.random() * noiseIntenseV) - noiseIntenseV/2) - highlightsCurve(avg, highlightsV) - shadowCurve(avg, shadowsV));
                
            }

        }

        
        //console.log(data);

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

function shadowCurve(x, b){
    return Math.floor(b*1/(Math.sqrt(2.0*3.14))*Math.exp(-(1/2)*((x-0)/42)*((x-0)/42))); //Lets hope this works bby
}
function highlightsCurve(x, b){
    return Math.floor(b*1/(Math.sqrt(2.0*3.14))*Math.exp(-(1/2)*((x-255)/64)*((x-255)/64)));
}

function splitUint8ClampedArray(arr, index) {
    const firstPart = arr.slice(0, index);
    const secondPart = arr.slice(index);
    return [firstPart, secondPart];
}

function joinUint8ClampedArrays(arr1, arr2) {
    const combined = new Uint8ClampedArray(arr1.length + arr2.length);
    combined.set(arr1, 0);
    combined.set(arr2, arr1.length);
    return combined;
}

async function renderWithWorkers(data) {
    const segmentsPerWorker = Math.round(data.length / 4);
    const chunks = _.chunk(data, segmentsPerWorker);

    // let each worker handle it's own part
    const promises = chunks.map(c => renderwithworkers(c));

    const segmentsResults = await Promise.all(promises);
    return segmentsResults.reduce((acc, arr) => acc.concat(arr), []);

}

// we turn the worker activation into a promise
const renderwithworkers = arr => {
    return new Promise((resolve, reject) => {
        let worker = new Worker('renderWorker.js');
        // wait for a message and resolve
        worker.onmessage = ({data}) => resolve(data);
        // if we get an error, reject
        worker.onerror = reject;
        // post a message to the worker
        worker.postMessage(arr);
    });
};