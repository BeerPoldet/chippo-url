const path = require('path')

const pagePath = 'views/pages/'
const pages = {
  index: `${pagePath}/index`,
  preview: `${pagePath}/preview`,
  notFound: `${pagePath}/notFound`,
}

module.exports = rootPath => ({
  routeFor: page => {
    return path.join(rootPath, pages[page])
  },
})
