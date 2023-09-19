const text = document.getElementById("text");
const sendButton = document.getElementById("upload");
const ctx = document.getElementById("chart");

let plotData = [
    0, 32, 64, 95, 125, 152, 177, 199, 218, 233, 244, 251, 254, 253, 248, 239,
    226, 209, 188, 165, 139, 110, 80, 48, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];

Plotly.newPlot(ctx, {
    data: [
        {
            x: [...Array(plotData.length).keys()],
            y: plotData,
            fill: "tozeroy",
            fillpattern: { shape: "/" },
            name: "Flow Profile",
            mode: "lines",
            line: {
                color: "#4C566A",
            },
        },
    ],
    config: { responsive: false, staticPlot: false },
    layout: {
        // height: 400,
        paper_bgcolor: "#00000000",
        plot_bgcolor: "#00000000",
        showlegend: false,
        xaxis: {
            visible: true,
            showgrid: false,
            zeroline: false,
            title: "Time Step",
        },
        yaxis: {
            visible: true,
            showgrid: false,
            zeroline: false,
            title: "Flow Rate",
        },
        margin: {
            l: 50,
            r: 0,
            b: 50,
            t: 50,
            pad: 0,
        },
        title: "Flow Profile",
        font: {
            family: "Sans-Serif",
            size: 18,
            color: "#7f7f7f",
        },
    },
});

sendButton.addEventListener("click", () => {
    window.api.writeToSerial(
        "<0,32,64,95,125,152,177,199,218,233,244,251,254,253,248,239,226,209,188,165,139,110,80,48,16,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0>"
    );
});

window.api.onSerialRead((_, data) => {
    const flowRate = data.split(",").map((str) => parseInt(str, 10));
    plotData = [...flowRate];
    // chart.data.y = plotData;
    // chart.update();

    // text.innerText = flowRate.length;
});

// const func = async () => {
//     const response = await window.api.ping();
//     console.log(response); // prints out 'pong'
// };
