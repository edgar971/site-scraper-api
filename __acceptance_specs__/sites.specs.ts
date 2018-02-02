import * as chai from 'chai'
import axios, { AxiosResponse } from 'axios'
import { Site } from 'common/interfaces';
import config from 'config'
import { saveSite, deleteSite } from 'common/repositories/sites'
import { closeDatabase } from 'common/postgres'

chai.should()
const apiUrl = `${config.web.baseUrl}:${config.web.port}/v2`

context('#sitesApi specs', () => {
  describe('when calling the API endpoint to list the sites successfully', () => {
    const url = `${apiUrl}/sites`
    const expectedSite1: Site = {
      url: 'http://website.com',
      directory: 'random/dir',
      base_path: 'basepath',
      title: 'an awesome site',
      screenshot: 'shot.png',
      entire_site: false,
      processed: false
    }
    const expectedSite2: Site = {
      url: 'http://website2.com',
      directory: 'random/dir',
      base_path: 'basepath',
      title: 'website 2',
      screenshot: 'shot.png',
      entire_site: false,
      processed: false
    }

    let savedSiteId1
    let savedSiteId2
    let response: AxiosResponse
    let sites: Site[]

    before(async () => {
      savedSiteId1 = await saveSite(expectedSite1)
      savedSiteId2 = await saveSite(expectedSite2)
      response = await axios.get(url)
      sites = response.data.data
    })

    it('should return 200', () => response.status.should.equal(200))
    it('should return the expected site 1', () => sites.filter(x => x.title === expectedSite1.title).length.should.eql(1))
    it('should return the expected site 2', () => sites.filter(x => x.title === expectedSite2.title).length.should.eql(1))

    after(async () => {
      await deleteSite(savedSiteId1)
      await deleteSite(savedSiteId2)
    })
  })

  after(() => {
    closeDatabase()
  })
})
