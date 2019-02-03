module.exports = function(length, charSet) {
  const characterSet =
    charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  return Array.from({ length }, () =>
    characterSet.charAt(Math.floor(Math.random() * characterSet.length)),
  ).join('')
}
