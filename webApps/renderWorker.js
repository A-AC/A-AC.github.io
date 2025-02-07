onmessage = (e) => {
    console.log("Worker: Message received from main script");

    const result = e.data[0] * e.data[1];
    //[firstHalf, exposureV, filter, noiseIntenseV, highlightsV, shadowsV]
    let data = e[0];
    const exposureV = e[1];
    const filter = e[2];
    const noiseIntenseV = e[3]
    const highlightsV = e[4]
    const shadowsV = e[5]
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
            data = e[0];
    }

    // render
    for (let i = 0; i < data.length; i += 4) {
        let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;

        data[i] = data[i] - (-exposureV - (Math.floor(Math.random() * noiseIntenseV) - noiseIntenseV/2) - highlightsCurve(avg, highlightsV) - shadowCurve(avg, shadowsV));
        data[i+1] = data[i+1] - (-exposureV - (Math.floor(Math.random() * noiseIntenseV) - noiseIntenseV/2) - highlightsCurve(avg, highlightsV) - shadowCurve(avg, shadowsV));
        data[i+2] = data[i+2] - (-exposureV - (Math.floor(Math.random() * noiseIntenseV) - noiseIntenseV/2) - highlightsCurve(avg, highlightsV) - shadowCurve(avg, shadowsV));
        
    }
    console.log("Worker: Posting message back to main script");
    postMessage(data);
};