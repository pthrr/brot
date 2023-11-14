const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });

function mandelbrotSet(c_re, c_im, max_iter) {
  let x = 0;
  let y = 0;
  let iter = 0;

  while (x * x + y * y <= 4 && iter < max_iter) {
    let x_new = x * x - y * y + c_re;
    y = 2 * x * y + c_im;
    x = x_new;
    iter++;
  }

  return { x, y, iter };
}

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(message) {
    const messageStr = message.toString();
    console.log("recv:", messageStr);
    const [c_re, c_im] = messageStr.split(",").map(Number);
    const max_iter = 1000;
    const mandelbrotValue = mandelbrotSet(c_re, c_im, max_iter);
    ws.send(JSON.stringify(mandelbrotValue));
  });
});
