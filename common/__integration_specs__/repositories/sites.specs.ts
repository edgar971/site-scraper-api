import * as chai from 'chai'
import { closeDatabase } from '../../postgres'
import { saveSite, getSite, deleteSite, getSites } from '../../repositories/sites'
import { Site } from '../../interfaces'
import config from 'config'

chai.should()
const expect = chai.expect

context('#sites repository integration specs', () => {
  describe('when saving a site successfully', () => {
    let savedSite: Site
    let savedSiteId
    const site: Site = {
      url: 'websiturl',
      directory: 'random/dir',
      base_path: 'base/path',
      title: 'website',
      screenshot: 'string.png',
      entire_site: false,
      processed: false
    }

    before(async () => {
      savedSiteId = await saveSite(site)
      savedSite = await getSite(savedSiteId)
    })

    it('should return the url', () => savedSite.url.should.equal(site.url))
    it('should return the directory', () => savedSite.directory.should.equal(site.directory))
    it('should return the base_path', () => savedSite.base_path.should.equal(site.base_path))
    it('should return the title', () => savedSite.title.should.equal(site.title))
    it('should return the screenshot', () => savedSite.screenshot.should.equal(site.screenshot))
    it('should return the entire_site', () => savedSite.entire_site.should.equal(site.entire_site))
    it('should return the processed', () => savedSite.processed.should.equal(site.processed))

    after(async () => {
      await deleteSite(savedSiteId)
    });
  })

  describe('when deleting a site record successfully', () => {
    let savedSite: Site
    let savedSiteId
    const site: Site = {
      url: 'websiturl',
      directory: 'random/dir',
      base_path: 'base/path',
      title: 'website',
      screenshot: 'string.png',
      entire_site: false,
      processed: false
    }

    before(async () => {
      savedSiteId = await saveSite(site)
      await deleteSite(savedSiteId)
      savedSite = await getSite(savedSiteId)
    })

    it('should return a null record', () => expect(savedSite).to.be.null)
  })
  
  after(() => {
    closeDatabase()
  })

  describe('when loading multiple site records successfully', () => {
    let savedSites: Site[]
    let savedSiteId1
    let savedSiteId2

    const site1: Site = {
      url: 'websiturl',
      directory: 'random/dir',
      base_path: 'base/path',
      title: 'website',
      screenshot: 'string.png',
      entire_site: false,
      processed: false
    }

    const site2: Site = {
      url: 'websiturltwo',
      directory: 'random/dir/2',
      base_path: 'base/path',
      title: 'website 2',
      screenshot: 'string.png',
      entire_site: false,
      processed: true
    }

    before(async () => {
      savedSiteId1 = await saveSite(site1)
      savedSiteId2 = await saveSite(site2)
      savedSites = await getSites()
    })

    it('should return two records', () => savedSites.length.should.equal(2))
    it('should contain site one', () => savedSites.filter(x => x.title === site1.title).length.should.equal(1))
    it('should contain site two', () => savedSites.filter(x => x.title === site2.title).length.should.equal(1))

    after(async () => {
      await deleteSite(savedSiteId1)
      await deleteSite(savedSiteId2)
    })
  })
  
  after(() => {
    closeDatabase()
  })
})
