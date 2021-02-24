// Determine which credentials to return

// Heroku sets the NODE_ENV port to prod

if (process.env.NODE_ENV === "production") {
  // in production - return production keys
  module.exports = require('./prod')

} else {
    // Pull the dev set of keys in, and export them
    module.exports = require('./dev')
}
