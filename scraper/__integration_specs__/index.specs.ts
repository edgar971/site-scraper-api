import * as chai from 'chai'
import { getPageHTMLContent } from '../index'

chai.should()

context('#Scraper integration tests', () => {
  describe('when scraping a single successfully', () => {
    const targetWebsite = 'https://www.edgarpino.com/'
    let content

    before(async ()=> {
      content = await getPageHTMLContent(targetWebsite)
    });

    it('should return the HTML content', () => content.should.not.be.null)
    
  })
})