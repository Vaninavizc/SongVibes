const song = document.getElementById("song");
const music = document.getElementById("music");

let audio;
let canvas;
let ctx;
let center_x; 
let center_y;
let radius;
let bars;
let bar_height;
let bar_width;
let frequency_array;

document.addEventListener(
"DOMContentLoaded",
function() {
    audio = new Audio();
    audio.controls = true;
    audio.autoplay = false;
    audio.loop = true;

    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    bar_width = 6;

    music.appendChild(audio);

    context = new (window.AudioContext || window.webkitAudioContext)();
    analyser = context.createAnalyser();
    source = context.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(context.destination);
    frequency_array = new Uint8Array(analyser.frequencyBinCount);

    song.addEventListener("change", e => {
        let reader = new FileReader();

        context.resume();

        if (song.files && song.files[0]) {
            let reader = new FileReader();
            reader.addEventListener("load", e => {
                audio.setAttribute("src", e.target.result);
            });

            reader.readAsDataURL(song.files[0]);
        }
    });

    draw();
},
false
);

function draw() {
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

center_x = canvas.width / 2;
center_y = canvas.height / 2;
radius = 200;

ctx.clearRect(0, 0, canvas.width, canvas.height);

ctx.strokeStyle = "black";
ctx.beginPath();
ctx.arc(center_x, center_y, radius, 0, 6 * Math.PI);
ctx.stroke();

analyser.getByteFrequencyData(frequency_array);
bars = 1000 / bar_width;
for (let i = 0; i < bars; i++) {
    rads = (Math.PI * 8) / bars;

    bar_height = frequency_array[i] * 0.75;

    x = center_x + Math.cos(rads * i) * radius;
    y = center_y + Math.sin(rads * i) * radius;
    x_end = center_x + Math.cos(rads * i) * (radius + bar_height);
    y_end = center_y + Math.sin(rads * i) * (radius + bar_height);

    drawBar(x, y, x_end, y_end, bar_width, frequency_array[i]);
}

window.requestAnimationFrame(draw);
}

function drawBar(x1, y1, x2, y2, width, frequency) {
let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
gradient.addColorStop(0, "#ed6ea0");
gradient.addColorStop(1, "#ec8c69");

ctx.strokeStyle = gradient;
ctx.lineWidth = width;
ctx.beginPath();
ctx.moveTo(x1, y1);
ctx.lineTo(x2, y2);
ctx.stroke();
}
