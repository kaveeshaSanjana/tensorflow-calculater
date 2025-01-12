
// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
const URL = "./my_model/";

let model, webcam, labelContainer, maxPredictions;

// Load the image model and setup the webcam
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    const flip = true; // whether to flip the webcam
    webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // append elements to the DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }
}

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}


let correctTimesArray = new Array(30);
let count = 0;
// run the webcam image through the image model
async function predict() {
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions - 1; i++) {
        if (count == 30) {

            //adding scanned lables count to the Array && Finding most times scanned lable place
            const predictValuePlace = getTheMostTimeScannedLablePlace(addCountToLablesSelectedArray())

            if (prediction[predictValuePlace].className == equal) {
                solved(document.getElementById("values").textContent);
            } else {
                addASymbol(prediction[predictValuePlace].className);
            }
        }

        if (parseInt(prediction[i].probability.toFixed(2)) == 1) {
            addItemToCorrectScannedArray(prediction[i].className);
        }

        console.log("Calls");
    }
}

function solved(statement) {

    console.log(math.evaluate(statement));

}

async function addASymbol(symbol) {

    document.getElementById("values").innerText += symbol;
    await sleep(3000);
    correctTimesArray = new Array(30);
    count = 0;

}

function addCountToLablesSelectedArray() {
    let lablesScannedCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < correctTimesArray.length; i++) {
        for (let ii = 0; ii < prediction.length; ii++) {
            if (prediction[ii].className == correctTimesArray[i]) {
                lablesScannedCount[ii] += 1;
            }
        }
    }
    return lablesScannedCount;
}

function getTheMostTimeScannedLablePlace(lablesScannedCount) {

    let predictValuePlace = 0;
    for (let i = 0; i < lablesScannedCount.length; i++) {
        if (predictValuePlace < lablesScannedCount[i]) {
            predictValuePlace = i;
            console.log("predict Value Place" + predictValuePlace);
        }
    }

    return predictValuePlace;
}

function addItemToCorrectScannedArray(value) {
    correctTimesArray[count++] = value;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
