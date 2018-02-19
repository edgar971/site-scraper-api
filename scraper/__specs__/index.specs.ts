import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import * as sinon from 'sinon'
import * as page from '../page'
import * as scraper from '../index'
import * as puppeteer from '../puppeteer/index'

chai.use(sinonChai)
chai.should()
const sandbox = sinon.sandbox.create()

context('#scrapePage', () => {
  describe('when scraping a single website with images, css, and js files successfully', () => {
    const siteUrl = 'example.com'
    let pageStub
    let gotoStub
    let closeStub 

    before(async () => {
      gotoStub = sandbox.stub().resolves()
      closeStub = sandbox.stub().resolves()
      pageStub = {
        goto: gotoStub,
        close: closeStub
      }
      sandbox.stub(puppeteer, 'createBrowserPage').resolves(pageStub)
      sandbox.stub(page, 'savePageImages')
      sandbox.stub(page, 'savePageCSSAndJS')
      await scraper.scrapePage(siteUrl)
    })

    it('should have created the browser page', () => puppeteer.createBrowserPage.should.have.been.called)
    it('should have navigavated to the url', () => gotoStub.should.have.been.calledWithExactly(siteUrl));
    it('should have saved the images', () => page.savePageImages.should.have.been.calledWithExactly(pageStub));
    it('should have saved the css and javascript files', () => page.savePageCSSAndJS.should.been.calledWithExactly(pageStub));
    it('should have closed the browser page', () => closeStub.should.have.been.called)

    after(async () => {
      await puppeteer.closeBrowser()
      sandbox.restore()
    })
  })
})