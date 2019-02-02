const express = require('express')
const app = express()
const port = process.env['PORT'] || 5000

app.get('/', (req, res) => {
  res.send('Hello, Mars')
})

const urlTable = {
  'aaa': "https://google.com",
  'bbb': "https://facebook.com",
  'ccc': "https://twitter.com"
}

async function findURL(code) {
  if (!code) return undefined
  return urlTable[code]
}

app.get('/:code', async (req, res) => {
  const url = await findURL(req.params['code'])
  if (url)
    res.redirect(url)
  else
    res.send('URL Not Found')
})

app.listen(port, () => {
  console.log(`Application is running at ${port}`)
})
