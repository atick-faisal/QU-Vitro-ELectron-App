const text = document.getElementById("text");

const connectButton = document.getElementById("connect");
const sendButton = document.getElementById("upload");
const ctx = document.getElementById("chart");
const flowPicker = document.getElementById("flow-picker");

const connectionSwitch = document.getElementById("connection-switch");
const connectionStatus = document.getElementById("connection-status");
const flowPeriodInput = document.getElementById("flow-period");
const diameterInput = document.getElementById("diameter");

let isLight = false
const html = document.documentElement
const switchTheme = document.getElementById('theme_switcher')
const os_default = '<svg viewBox="0 0 16 16"><path fill="currentColor" d="M8 15A7 7 0 1 0 8 1v14zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16z"/></svg>'
const sun = '<svg viewBox="0 0 16 16"><path fill="currentColor" d="M8 11a3 3 0 1 1 0-6a3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8a4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/></svg>'
const moon = '<svg viewBox="0 0 16 16"><g fill="currentColor"><path d="M6 .278a.768.768 0 0 1 .08.858a7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277c.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316a.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71C0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278zM4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.316 7.316 0 0 0 5.205-2.162c-.337.042-.68.063-1.029.063c-4.61 0-8.343-3.714-8.343-8.29c0-1.167.242-2.278.681-3.286z"/><path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z"/></g></svg>'

document.addEventListener('DOMContentLoaded', () => {
    switchTheme.innerHTML = os_default
    html.setAttribute('data-theme', 'dark')
})
switchTheme.addEventListener('click', (e) => {
    e.preventDefault()
    isLight = !isLight
    html.setAttribute('data-theme', isLight ? 'light' : 'dark')
    switchTheme.innerHTML = isLight ? sun : moon
})

const nFLowPoints = 50;

const AORTA_ROOT = [
    55, 79, 140, 200, 230, 246, 255, 255, 248, 234, 219, 199, 171, 145, 124, 98, 55, 43, 54, 54, 54, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 56, 55, 55, 55, 54, 54, 55, 55, 55, 55, 55, 54, 54, 53, 53, 53, 54, 55
]

const ANTERIOR_TIBIAL = [
    101, 102, 103, 103, 103, 102, 101, 100, 99, 98, 97, 101, 140, 207, 240, 255, 255, 247, 235, 221, 205, 181, 154, 129, 108, 92, 80, 55, 72, 83, 96, 109, 118, 125, 128, 132, 131, 128, 123, 116, 111, 107, 104, 101, 99, 98, 97, 98, 99, 101
]

const ASCENDING_AORTA = [
    59, 70, 120, 188, 222, 241, 254, 255, 248, 236, 224, 212, 185, 159, 134, 107, 77, 31, 60, 52, 54, 56, 56, 57, 58, 59, 62, 62, 63, 63, 62, 63, 62, 61, 60, 59, 58, 58, 58, 58, 59, 59, 59, 59, 58, 58, 58, 58, 58, 59
]

const BIFURCATION = [
    78, 77, 76, 75, 74, 73, 73, 85, 142, 206, 240, 255, 253, 242, 224, 203, 178, 144, 110, 79, 55, 37, 18, 2, 25, 38, 59, 75, 88, 97, 103, 106, 105, 101, 95, 86, 80, 75, 72, 69, 67, 66, 67, 69, 71, 74, 76, 77, 78, 78
]

const BRACHIAL = [
    86, 85, 85, 85, 101, 158, 216, 239, 255, 254, 239, 226, 208, 192, 173, 153, 133, 116, 103, 85, 72, 100, 99, 111, 117, 113, 112, 109, 105, 100, 98, 94, 88, 87, 87, 87, 89, 89, 90, 91, 92, 93, 94, 93, 93, 91, 90, 88, 87, 86
]

const CAROTID = [
    136, 136, 146, 203, 255, 229, 227, 243, 242, 236, 230, 223, 218, 196, 192, 193, 186, 175, 132, 217, 185, 176, 185, 179, 178, 173, 170, 168, 158, 158, 155, 152, 154, 150, 150, 150, 149, 150, 149, 149, 148, 147, 146, 144, 142, 140, 139, 138, 137, 136
]

const DESCENDING_AORTA = [
    71, 71, 71, 90, 146, 199, 226, 239, 246, 251, 255, 254, 246, 218, 181, 144, 113, 85, 45, 29, 37, 37, 44, 50, 58, 67, 76, 87, 90, 92, 91, 87, 85, 81, 78, 74, 70, 67, 65, 66, 67, 68, 69, 70, 71, 72, 72, 72, 72, 71
]

const FEMORAL = [
    75, 76, 75, 74, 73, 72, 71, 71, 71, 82, 144, 218, 248, 255, 244, 226, 206, 185, 163, 131, 99, 70, 50, 36, 21, 1, 31, 47, 67, 82, 91, 97, 101, 103, 100, 96, 89, 81, 75, 71, 69, 67, 65, 65, 66, 67, 70, 73, 75, 76
]

const ILIAC = [
    81, 80, 79, 78, 77, 76, 76, 76, 98, 170, 224, 250, 255, 245, 229, 209, 187, 161, 128, 96, 69, 51, 37, 15, 16, 38, 54, 74, 87, 98, 104, 109, 109, 106, 101, 93, 86, 80, 76, 73, 71, 70, 70, 71, 73, 76, 78, 80, 81, 81
]

const RADIAL = [
    133, 131, 130, 129, 128, 128, 146, 196, 234, 248, 255, 252, 244, 237, 227, 220, 206, 194, 181, 172, 163, 143, 147, 161, 162, 168, 169, 165, 164, 161, 158, 153, 152, 147, 143, 142, 141, 141, 141, 141, 141, 140, 140, 140, 140, 139, 138, 136, 135, 133
]

const THORACIC_AORTA = [
    86, 86, 85, 84, 97, 139, 180, 206, 229, 245, 254, 255, 244, 227, 199, 168, 136, 107, 81, 49, 38, 45, 47, 58, 70, 82, 95, 103, 110, 113, 113, 111, 105, 101, 96, 91, 87, 83, 81, 80, 80, 81, 83, 85, 86, 87, 87, 87, 87, 86
]

const HALF_SIN_WAVE = [
    0, 32, 64, 95, 125, 152, 177, 199, 218, 233, 244, 251, 254, 253, 248, 239,
    226, 209, 188, 165, 139, 110, 80, 48, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];

const FULL_SIN_WAVE = [
    0, 32, 64, 95, 125, 152, 177, 199, 218, 233, 244, 251, 254, 253, 248, 239,
    226, 209, 188, 165, 139, 110, 80, 48, 16, 16, 48, 80, 110, 139, 165, 188,
    209, 226, 239, 248, 253, 254, 251, 244, 233, 218, 199, 177, 152, 125, 95,
    64, 32, 0,
];

const maxFlowRate = 40;
const minFLowRate = -10;

let pumpType = 1;
let flowData = [...HALF_SIN_WAVE];
let flowPeriod = 2000;
let diameter = 100;
let connected = false;

const mapToTimePoints = (x) => {
    return (x / nFLowPoints) * flowPeriod;
}

const mapToActualFlowRate = (x) => {
    return (x * (maxFlowRate - minFLowRate) / 255.0) + minFLowRate;
}

const setFlowData = (x) => {
    flowData = []
    for (let i = 0; i < 50; i++) {
        flowData.push(x[i]);
    }
}

const setTagetFlow = (x) => {
    setFlowData(x);
    updateTargetFlowPlotData(x);
}

var plotData = [
    {
        x: [...Array(HALF_SIN_WAVE.length).keys()].map(mapToTimePoints),
        y: HALF_SIN_WAVE.map(mapToActualFlowRate),
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
        title: "Flow Rate (mL/min)",
        range: [minFLowRate - 10, maxFlowRate + 10],
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

const updateTargetFlowPlotData = (x) => {
    flowData = []
    for (let i = 0; i < 50; i++) {
        flowData.push(x[i]);
    }
    plotData[0]["x"] = [...Array(flowData.length).keys()].map(mapToTimePoints);
    plotData[0]["y"] = [...flowData].map(mapToActualFlowRate);
    Plotly.update(ctx, plotData, plotLayout, plotConfig);
}

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
    if (diameterInput.value != "") {
        const value = parseInt(diameterInput.value);
        if (value < 10 || value > 1000) {
            alert("Invalid Diameter");
            return;
        }
        diameter = value;
    }
    let configuration = `${pumpType},${flowPeriod},${diameter}|`;
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
    console.warn(data)
    const flowRate = data.split(",").map((str) => parseInt(str, 10));
    plotData[1]["x"] = [...Array(flowRate.length).keys()].map(mapToTimePoints);
    plotData[1]["y"] = [...flowRate].map(mapToActualFlowRate).map((x) => x - 10);
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
    e.preventDefault();
    const summary = flowProfileSelector.querySelector("summary");
    const selectedItem = e.target.textContent;
    summary.innerText = selectedItem;
    const flowProfile = selectedItem.toLowerCase();
    flowProfileSelector.removeAttribute("open");
    if (flowProfile === "custom") flowPicker.style.display = "block";
    else {
        if (flowProfile === "half sine wave") {
            setTagetFlow(HALF_SIN_WAVE);
        } else if (flowProfile === "full sine wave") {
            setTagetFlow(FULL_SIN_WAVE);
        } else if (flowProfile === "ant tibial") {
            setTagetFlow(ANTERIOR_TIBIAL);
        } else if (flowProfile === "aorta root") {
            setTagetFlow(AORTA_ROOT);
        } else if (flowProfile === "asc aorta") {
            setTagetFlow(ASCENDING_AORTA);
        } else if (flowProfile === "desc aorta") {
            setTagetFlow(DESCENDING_AORTA);
        } else if (flowProfile === "bifurcation") {
            setTagetFlow(BIFURCATION);
        } else if (flowProfile === "brachial") {
            setTagetFlow(BRACHIAL);
        } else if (flowProfile === "carotid") {
            setTagetFlow(CAROTID);
        } else if (flowProfile === "femoral") {
            setTagetFlow(FEMORAL);
        } else if (flowProfile === "iliac") {
            setTagetFlow(ILIAC);
        } else if (flowProfile === "radial") {
            setTagetFlow(RADIAL);
        } else if (flowProfile === "thoracic aorta") {
            setTagetFlow(THORACIC_AORTA);
        }
        flowPicker.style.display = "none";
    }
});




