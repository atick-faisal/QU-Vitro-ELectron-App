const text = document.getElementById("text");
const sendButton = document.getElementById("button");

sendButton.addEventListener("click", () => {
    window.api.writeToSerial(
        "<0,32,64,95,125,152,177,199,218,233,244,251,254,253,248,239,226,209,188,165,139,110,80,48,16,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0>"
    );
});

window.api.onSerialRead((_, data) => {
    const flowRate = data.split(",").map((str) => parseInt(str, 10));
    text.innerText = flowRate.length;
});

// const func = async () => {
//     const response = await window.api.ping();
//     console.log(response); // prints out 'pong'
// };
