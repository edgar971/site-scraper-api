import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import * as sinon from 'sinon'
import * as puppeteer from '../puppeteer'
import { closeBrowser } from '../puppeteer';
import * as page from '../page';

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


  // describe('when scraping a single website', () => {
  //   const siteUrl = 'example.com'
  //   const expectedHTML = 'really awesome site content'
  //   let result

  //   before(async () => {
  //     sandbox.stub(page, 'getHTMLContent').resolves(expectedHTML)
  //     result = await scraper.scrapePage(siteUrl)
  //   })

  //   it('should have called the getHTMLContent', () => page.getHTMLContent.should.have.been.calledWithExactly(siteUrl))

  //   after(async () => {
  //     await closeBrowser()
  //     sandbox.restore()
  //   })
  // })