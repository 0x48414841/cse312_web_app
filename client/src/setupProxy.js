const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
  app.use(
    ["/api", "/auth/google", "/home", "/home/js", "/home/file", "/game", "/game.js",  "/socket.io/socket.io.js", "/socket.io/"],
    createProxyMiddleware({
      target: "http://127.0.0.1:5000",
    })
  );
};