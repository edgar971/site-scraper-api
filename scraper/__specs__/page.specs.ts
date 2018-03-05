import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import * as sinon from 'sinon'
import * as cheerio from 'cheerio'
import * as puppeteer from '../puppeteer'
import { closeBrowser } from '../puppeteer'
import * as page from '../page'

chai.use(sinonChai)
chai.should()
const sandbox = sinon.sandbox.create()

context('#getHTMLContent specs', () => {
  describe('when getting data for a url successfully', () => {
    const siteUrl = 'example.com'
    const expectedResult = '<h1>Welcome</h1>'
    let gotoSub
    let contentSub
    let result

    before(async () => {
      gotoSub = sandbox.stub().resolves({})
      contentSub = sandbox.stub().resolves(expectedResult)
      sandbox.stub(puppeteer, 'createBrowserPage').resolves({
        goto: gotoSub,
        content: contentSub
      })

      result = await page.getHTMLContent(siteUrl)
    })

    it('should go to the page with the correct url', () => gotoSub.should.have.been.calledWithExactly(siteUrl))
    it('should get the page content', () => contentSub.should.have.been.called)
    it('should return the expected result', () => result.should.eql(expectedResult))

    after(async () => {
      await closeBrowser()
      sandbox.restore()
    })
  })
})

context('#getPageImageUrls', () => {
  describe('when querying a page with two image urls', () => {
    let pageStub
    let imageUrls: string[]
    let domCheerio
    let mapStub
    let getStub
    const htmlContent = '<html>really cool html</html>'
    const expectedLinks = ['url', 'url2']

    before(async () => {
      getStub = sandbox.stub().returns(expectedLinks)
      mapStub = sandbox.stub().returns({
        get: getStub
      })
      domCheerio = sandbox.stub().returns({
        map: mapStub
      })
      pageStub = {
        content: sandbox.stub().resolves(htmlContent)
      }

      sandbox.stub(cheerio, 'load').returns(domCheerio)
      imageUrls = await page.getPageImageUrls(pageStub)
    })

    it('should have retrived the html content from the page', () => pageStub.content.should.have.been.called)
    it('should have loaded the content with cheerio', () => cheerio.load.should.have.been.calledWithExactly(htmlContent))
    it('should have queried the dom with the rigth selector', () => domCheerio.should.have.been.calledWithExactly(page.IMAGES_DOCUMENT_SELECTOR));
    it('should have mapped over the link elements', () => mapStub.should.have.been.called);
    it('should have called get to get array of links', () => getStub.should.have.been.called);
    it('should have retrieved the attribute', () => imageUrls.should.equal(expectedLinks));

    after(() => sandbox.restore())
  })
})
