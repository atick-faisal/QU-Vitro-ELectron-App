const text = document.getElementById("text");
const sendButton = document.getElementById("upload");
const ctx = document.getElementById("chart");
const flowPicker = document.getElementById("flow-picker");
const halfSineWave = [
    0, 32, 64, 95, 125, 152, 177, 199, 218, 233, 244, 251, 254, 253, 248, 239,
    226, 209, 188, 165, 139, 110, 80, 48, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];

const fullSineWave = [
    0, 32, 64, 95, 125, 152, 177, 199, 218, 233, 244, 251, 254, 253, 248, 239,
    226, 209, 188, 165, 139, 110, 80, 48, 16, 16, 48, 80, 110, 139, 165, 188,
    209, 226, 239, 248, 253, 254, 251, 244, 233, 218, 199, 177, 152, 125, 95,
    64, 32, 0,
];

let pumpType = 1;
let flowData = [...halfSineWave];
let flowPeriod = 2000;

var plotData = [
    {
        x: [...Array(halfSineWave.length).keys()].map(
            (x) => x / halfSineWave.length * flowPeriod
        ),
        y: halfSineWave,
        fill: "tozeroy",
        fillpattern: { shape: "/" },
        name: "Flow Profile",
        mode: "lines",
        line: {
            color: "#4C566A",
        },
    },
];

const plotConfig = { responsive: false, staticPlot: true };

const plotLayout = {
    paper_bgcolor: "#00000000",
    plot_bgcolor: "#00000000",
    showlegend: false,
    xaxis: {
        visible: true,
        showgrid: false,
        zeroline: false,
        title: "Time Step (ms)",
    },
    yaxis: {
        visible: true,
        showgrid: false,
        zeroline: false,
        title: "Flow Rate (mL/h)",
    },
    margin: {
        l: 50,
        r: 0,
        b: 40,
        t: 30,
        pad: 0,
    },
    title: "Flow Profile",
    font: {
        family: "Sans-Serif",
        size: 14,
        color: "#7f7f7f",
    },
};

flowPicker.addEventListener("change", (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    const reader = new FileReader();
    reader.onload = function (event) {
        const fileContent = event.target.result;
        flowData = fileContent.split(",").map(Number);
        plotData[0]["x"] = [...Array(flowData.length).keys()];
        plotData[0]["y"] = [...flowData];
        Plotly.update(ctx, plotData, plotLayout, plotConfig);
    };
    reader.readAsText(selectedFile);
});

Plotly.newPlot(ctx, plotData, plotLayout, plotConfig);

sendButton.addEventListener("click", () => {
    const serialData = "<" + flowData.join(",") + ">";
    window.api.writeToSerial(serialData);
});

// window.api.onSerialRead((_, data) => {
//     const flowRate = data.split(",").map((str) => parseInt(str, 10));
//     plotData = [...flowRate];
//     // chart.data.y = plotData;
//     // chart.update();

//     // text.innerText = flowRate.length;
// });

// const func = async () => {
//     const response = await window.api.ping();
//     console.log(response); // prints out 'pong'
// };

// ... Pump Type Selector
const pumpSelector = document.getElementById("pump-selector");
pumpSelector.querySelector("ul").addEventListener("click", (e) => {
    const summary = pumpSelector.querySelector("summary");
    const selectedItem = e.target.textContent;
    summary.innerText = selectedItem;
    if (selectedItem.toLowerCase() === "syringe") pumpType = 1;
    else pumpType = 2;
    pumpSelector.removeAttribute("open");
});

// ... Flow Profile Selector
const flowProfileSelector = document.getElementById("flow-profile-selector");
flowProfileSelector.querySelector("ul").addEventListener("click", (e) => {
    const summary = flowProfileSelector.querySelector("summary");
    const selectedItem = e.target.textContent;
    summary.innerText = selectedItem;
    const flowProfile = selectedItem.toLowerCase();
    flowProfileSelector.removeAttribute("open");
    if (flowProfile === "custom") flowPicker.style.display = "block";
    else {
        if (flowProfile === "half sine wave") {
            flowData = [...halfSineWave];
            plotData[0]["x"] = [...Array(halfSineWave.length).keys()];
            plotData[0]["y"] = [...halfSineWave];
            Plotly.update(ctx, plotData, plotLayout, plotConfig);
        } else if (flowProfile === "full sine wave") {
            flowData = [...fullSineWave];
            plotData[0]["x"] = [...Array(fullSineWave.length).keys()];
            plotData[0]["y"] = [...fullSineWave];
            Plotly.update(ctx, plotData, plotLayout, plotConfig);
        }
        flowPicker.style.display = "none";
    }
});
