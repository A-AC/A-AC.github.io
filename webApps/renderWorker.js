onmessage = (e) => {
    console.log("Worker: Message received from main script");

    const exposureS = 100;
    const noiseIntenseS = 100;
    const highlightsS = 100;
    const shadowsS = 100;
    var filter = "";

    //[firstHalf, exposureV, filter, noiseIntenseV, highlightsV, shadowsV]
    var data = e;

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
            noiseIntenseS = 100;
            noiseIntenseS.value = 100;
            exposureS = 10;
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

        data[i] = data[i] - (-exposureS - (Math.floor(Math.random() * noiseIntenseS) - noiseIntenseS/2) - highlightsCurve(avg, highlightsS) - shadowCurve(avg, shadowsS));
        data[i+1] = data[i+1] - (-exposureS - (Math.floor(Math.random() * noiseIntenseS) - noiseIntenseS/2) - highlightsCurve(avg, highlightsS) - shadowCurve(avg, shadowsS));
        data[i+2] = data[i+2] - (-exposureS - (Math.floor(Math.random() * noiseIntenseS) - noiseIntenseS/2) - highlightsCurve(avg, highlightsS) - shadowCurve(avg, shadowsS));
        
    }
    console.log("Worker: Posting message back to main script");
    postMessage(data);
    self.close();
};