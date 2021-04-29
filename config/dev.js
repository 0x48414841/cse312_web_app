
module.exports = {
    googleClientID: "490596678911-4pem6iidu8n48k8bup2fksk4rj2nt250.apps.googleusercontent.com",
    googleClientSecret: "hzXeRnwz1RAVSsCldc9f0grr",
    //mongoURI: "mongodb+srv://bailey8:100679Vcs-@email-app-prod.g0e20.mongodb.net/Email-App-Prod?retryWrites=true&w=majority",
    //mongoURI: "mongodb://mongo:27017/db",
    mongoURI: process.env.MONGO_URI.toString().trim(),
    //ip: process.env.IP.toString().trim(),
    cookieKey: "anything",
 }

