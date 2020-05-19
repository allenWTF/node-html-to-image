const puppeteer = require('puppeteer')
const handlebars = require('handlebars')

module.exports = async function({
  html,
  output,
  type,
  content,
  quality, // only applicable for jpg
  waitUntil = 'load',
  transparent = false,
  puppeteerArgs = {},
  encoding
}) {
  if (!html) {
    throw Error('You must provide an html property.')
  }
  const browser = await puppeteer.launch({ ...puppeteerArgs, headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox']});
  const page = await browser.newPage()
  if (content) {
    const template = handlebars.compile(html)
    html = template(content, { waitUntil })
  }
  await page.setContent(html)
  await page.setViewport({width: 0, height: 0, deviceScaleFactor: 4});
  const element = await page.$('body')
  await element.evaluate(() => document.body.style.background = "transparent");
  const buffer = await element.screenshot({ path: output, type, quality, omitBackground: true, encoding })
  await browser.close()
  return buffer
}
