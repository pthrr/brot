const canvas = document.getElementById("mandelbrotCanvas");
const scale = window.devicePixelRatio;
canvas.width = 800 * scale;
canvas.height = 600 * scale;
const ctx = canvas.getContext("2d");
ctx.scale(scale, scale);

const socket = new WebSocket("ws://localhost:8080");

socket.onopen = function (e) {
  drawMandelbrot();
};

function getColor(iter, max_iter) {
  const smoothIter = Math.sqrt(iter / max_iter);
  const hue = 360 * smoothIter;
  const saturation = 85;
  const lightness = 50 + 10 * Math.sin(2 * Math.PI * smoothIter);
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

socket.onmessage = function (event) {
  const { x, y, iter } = JSON.parse(event.data);
  const canvasX = (x * canvas.width) / 4.0 + canvas.width / 2.0;
  const canvasY = (y * canvas.height) / 4.0 + canvas.height / 2.0;
  const color = iter === 1000 ? "#000" : getColor(iter, 1000);
  ctx.fillStyle = color;
  ctx.fillRect(canvasX, canvasY, 1, 1);
};

function drawMandelbrot() {
  const width = canvas.width;
  const height = canvas.height;

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let c_re = ((x - width / 2.0) * 4.0) / width;
      let c_im = ((y - height / 2.0) * 4.0) / width;

      if (socket.readyState === WebSocket.OPEN) {
        socket.send(`${c_re},${c_im}`);
      }
    }
  }
}
