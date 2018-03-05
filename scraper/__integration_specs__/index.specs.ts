import * as chai from 'chai'
import { getHTMLContent } from '../page';
import { closeBrowser } from '../puppeteer/index'

chai.should()

context.only('#Scraper integration tests', () => {
  describe('when scraping a single successfully', () => {
    const targetWebsite = 'https://www.edgarpino.com/'
    let content

    before(async () => {
      content = await getHTMLContent(targetWebsite)
    });

    it('should return the HTML content', () => content.should.not.be.null)

  })

  after(async () => {
    await closeBrowser()
  })
})