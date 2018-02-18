import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import * as sinon from 'sinon'
import * as page from '../page'
import * as scraper from '../index'
import { closeBrowser } from '../puppeteer/index'


chai.use(sinonChai)
chai.should()
const sandbox = sinon.sandbox.create()

context('#scrapePage', () => {
    describe('when scraping a single website', () => {
    const siteUrl = 'example.com'
    const expectedHTML = 'really awesome site content'
    let result

    before(async () => {
      sandbox.stub(page, 'getHTMLContent').resolves(expectedHTML)
      result = await scraper.scrapePage(siteUrl)
    })

    it('should have called the getHTMLContent', () => page.getHTMLContent.should.have.been.calledWithExactly(siteUrl))
    it('should return the HTML', () => result.should.equal(expectedHTML))

    after(async () => {
      await closeBrowser()
      sandbox.restore()
    })
  })
})