const path = require('path')
const mode = process.env['NODE_ENV'] || 'development'

module.exports = {
  app: {
    mode,
    rootPath: path.join(__dirname, '../'),
    port: process.env['PORT'] || 5000,
  },
  isInMemory: process.env.DB_TYPE === 'inmemory',
  db: {
    url: process.env['MONGODB_URI'] || 'mongodb://localhost:27017',
    name: mode === 'production' ? 'chippo' : 'chippo_dev',
  },
}
