const chippos = {
  aaa: 'https://google.com',
  bbb: 'https://facebook.com',
  ccc: 'https://twitter.com',
}

module.exports = async () => ({
  chippo: {
    findChippoURLByAlias: async function(alias) {
      if (!alias) return undefined
      const url = chippos[alias]
      if (!url) return undefined
      return { alias, url }
    },

    findChippoURLByURL: async function(url) {
      if (!url) return undefined
      const alias = Object.keys(chippos).find(key => chippos[key] === url)
      if (!alias) return undefined
      return { alias, url }
    },

    insertURL: async function(alias, url) {
      chippos[alias] = url
      return true
    },
  },
})
