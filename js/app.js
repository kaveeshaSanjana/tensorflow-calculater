
// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel



const URL = "./my_model/";
let model, webcam, labelContainer, maxPredictions, prediction;

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
    webcam = new tmImage.Webcam(500, 500, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // append elements to the DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);

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
    prediction = await model.predict(webcam.canvas);
    if (count == 30) {

        //adding scanned lables count to the Array && Finding most times scanned lable place
        const predictValuePlace = getTheMostTimeScannedLablePlace(addCountToLablesSelectedArray())

        if (prediction[predictValuePlace].className == 5) {
            solved(document.getElementById("inputBar").value);
            await sleep(5000);
        } else {
            addASymbol(prediction[predictValuePlace].className);
            await sleep(2000);
        }
    }
    for (let i = 0; i < maxPredictions - 1; i++) {


        if (parseInt(prediction[i].probability.toFixed(2)) == 1) {
            addItemToCorrectScannedArray(prediction[i].className);
        }

        console.log("Calls");
    }
}

async function solved(statement) {
    await sleep(5000);
    document.getElementById("inputBar").value = eval(statement);
    correctTimesArray = new Array(30);
    count = 0;
    updateProgressBar(document.querySelector('.progress'), 0, 29);
}

async function addASymbol(symbol) {
    addValuesToInputBar(symbol)
    correctTimesArray = new Array(30);
    count = 0;
    updateProgressBar(document.querySelector('.progress'), 0, 29);
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

    let predictValue = 0;
    let maxValuePlace = 0
    for (let i = 0; i < lablesScannedCount.length; i++) {
        if (predictValue < lablesScannedCount[i]) {
            predictValue = lablesScannedCount[i];
            maxValuePlace = i;
            console.log("predict Value Place " + maxValuePlace);
        }
    }
    return maxValuePlace;
}

function addItemToCorrectScannedArray(value) {
    correctTimesArray[count] = value;
    updateProgressBar(document.querySelector('.progress'), count++, 29);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, 10000));
}


function addValuesToInputBar(value) {
    document.getElementById("inputBar").value += value;
}

Array.from(document.querySelectorAll('button')).forEach(button => {
    button.addEventListener('click', (e) => {
        if (e.target.innerHTML === '=') {
            document.getElementById("inputBar").value = eval(document.getElementById("inputBar").value)
        } else if (e.target.innerHTML === 'AC') {
            document.getElementById("inputBar").value = "";
        } else if (e.target.innerHTML !== 'Start') {
            document.getElementById("inputBar").value += e.target.innerHTML
        }
    });
});

function updateProgressBar(progressBar, value, compleatingValue) {
    progressBar.querySelector(".progress__fullfill").style.width = `${(Math.round(value * 100 / compleatingValue))}%`;
    progressBar.querySelector(".progress__text").textContent = `${(Math.round(value * 100 / compleatingValue))}%`;

}

init();
