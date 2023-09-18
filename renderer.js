const text = document.getElementById("text");
const sendButton = document.getElementById("button");

sendButton.addEventListener("click", () => {
    window.api.send("HELLO WORLD");
});

window.api.receive((_, data) => {
    text.innerText = data;
});

// const func = async () => {
//     const response = await window.api.ping();
//     console.log(response); // prints out 'pong'
// };
