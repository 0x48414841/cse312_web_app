const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
  app.use(
    ["/api", "/auth/google", "/home", "/home.js", "/home/file", "/game", "/game.js", "/current_users", "/socket.io/socket.io.js", "/socket.io/", "/upload_picture"],
    createProxyMiddleware({
      target: "http://127.0.0.1:5000",
    })
  );
};