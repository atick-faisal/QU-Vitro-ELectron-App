const text = document.getElementById("text");

const connectButton = document.getElementById("connect");
const sendButton = document.getElementById("upload");
const ctx = document.getElementById("chart");
const flowPicker = document.getElementById("flow-picker");

const connectionSwitch = document.getElementById("connection-switch");
const connectionStatus = document.getElementById("connection-status");
const flowPeriodInput = document.getElementById("flow-period");

const nFLowPoints = 50;

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

const maxFlowRate = 8;
const minFLowRate = -2;

let pumpType = 1;
let flowData = [...halfSineWave];
let flowPeriod = 2000;
let connected = false;

const mapToTimePoints = (x) => {
    return (x / nFLowPoints) * flowPeriod;
}

const mapToActualFlowRate = (x) => {
    return (x * (maxFlowRate - minFLowRate) / 255.0) + minFLowRate;
}

var plotData = [
    {
        x: [...Array(nFLowPoints).keys()].map(
            (x) => (x / nFLowPoints) * flowPeriod
        ),
        y: halfSineWave.map(mapToActualFlowRate),
        fill: "tozeroy",
        fillpattern: { shape: "/" },
        name: "Target Flow-Rate",
        mode: "lines",
        line: {
            color: "#D0BCFF",
        },
    },
    {
        x: [],
        y: [],
        fill: "tozeroy",
        fillpattern: { shape: "/" },
        name: "Actual Flow-Rate",
        mode: "lines",
        line: {
            color: "#EFB8C8",
        },
    },
];

const plotConfig = { responsive: false, staticPlot: true };

const plotLayout = {
    paper_bgcolor: "#00000000",
    plot_bgcolor: "#00000000",
    showlegend: true,
    legend: { x: 1, xanchor: "right", y: 1 },
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
        title: "Flow Rate",
        range: [minFLowRate - 1, maxFlowRate + 1],
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
        plotData[0]["x"] = [...Array(flowData.length).keys()].map(mapToTimePoints);
        plotData[0]["y"] = [...flowData].map(mapToActualFlowRate);
        Plotly.update(ctx, plotData, plotLayout, plotConfig);
    };
    reader.readAsText(selectedFile);
});

Plotly.newPlot(ctx, plotData, plotLayout, plotConfig);

sendButton.addEventListener("click", () => {
    if (flowPeriodInput.value != "") {
        const value = parseInt(flowPeriodInput.value);
        if (value < 0 || value > 5000) {
            alert("Invalid Period");
            return;
        }
        flowPeriod = value;
    }
    let configuration = `${pumpType},${flowPeriod}|`;
    const serialData = "<" + configuration + flowData.join(",") + ">";
    window.api.writeToSerial(serialData);
    console.warn(serialData);
});

connectButton.addEventListener("click", async () => {
    if (connected) {
        await window.api.disconnect();
        connectButton.innerText = "Connect";
        connectionStatus.innerText = "Device Disconnected";
        connected = false;
    } else {
        connected = await window.api.connect();
        if (connected) {
            connectButton.innerText = "Disconnect";
            connectionStatus.innerText = "Device Connected";
        } else alert("Connection Failed");
    }
    connectionSwitch.checked = connected;
});

window.api.onSerialRead((_, data) => {
    const flowRate = data.split(",").map((str) => parseInt(str, 10));
    plotData[1]["x"] = [...Array(flowRate.length).keys()].map(mapToTimePoints);
    plotData[1]["y"] = [...flowRate].map(mapToActualFlowRate);
    Plotly.update(ctx, plotData, plotLayout, plotConfig);
});

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
            plotData[0]["x"] = [...Array(nFLowPoints).keys()].map(mapToTimePoints);
            plotData[0]["y"] = [...halfSineWave].map(mapToActualFlowRate);
            Plotly.update(ctx, plotData, plotLayout, plotConfig);
        } else if (flowProfile === "full sine wave") {
            flowData = [...fullSineWave];
            plotData[0]["x"] = [...Array(fullSineWave.length).keys()].map(mapToTimePoints);
            plotData[0]["y"] = [...fullSineWave].map(mapToActualFlowRate);
            Plotly.update(ctx, plotData, plotLayout, plotConfig);
        }
        flowPicker.style.display = "none";
    }
});
