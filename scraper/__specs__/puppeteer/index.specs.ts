import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import * as sinon from 'sinon'
import * as puppeteer from 'puppeteer'
import { Page } from 'puppeteer';
import { createBrowserPage, closeBrowser } from 'scraper/puppeteer';

chai.use(sinonChai)
chai.should()

const sandbox = sinon.sandbox.create()

context('#puppeteer specs', () => {
  describe('when creating a browser page successully and the browser is not lunched', () => {
    let browserPage: Page
    let newPageStub
    let closeBrowerStub

    before(async () => {
      newPageStub = sandbox.stub().resolves(<Page>{})
      closeBrowerStub = sandbox.stub().resolves({})
      sandbox.stub(puppeteer, 'launch').resolves({
        newPage: newPageStub,
        close: closeBrowerStub
      })
      
      browserPage = await createBrowserPage()
    })

    it('should call the launch browser', () => puppeteer.launch.should.have.been.called)
    it('should call the new page function', () => newPageStub.should.have.been.called)
    it('should return a browser page', () => browserPage.should.not.be.null)
    
    after(async () => {
      await closeBrowser()
      sandbox.restore()
    })
  })

  describe('when creating a browser page successully and the browser is lunched', () => {
    let browserPage: Page
    let newPageStub
    let closeBrowerStub

    before(async () => {
      newPageStub = sandbox.stub().resolves({})
      closeBrowerStub = sandbox.stub().resolves({})
      sandbox.stub(puppeteer, 'launch').resolves({
        newPage: newPageStub,
        close: closeBrowerStub
      })

      await createBrowserPage()
      browserPage = await createBrowserPage()
    })

    it('should call the launch browser once', () => puppeteer.launch.should.have.been.calledOnce)
    it('should call the new page function', () => newPageStub.should.have.been.called)
    it('should a browser page', () => browserPage.should.not.be.null)
    
    after(async () => {
      await closeBrowser()
      sandbox.restore()
    })
  })

  describe('when closing a browser that is open', () => {
    let newPageStub
    let closeBrowerStub

    before(async () => {
      newPageStub = sandbox.stub().resolves({})
      closeBrowerStub = sandbox.stub().resolves({})
      sandbox.stub(puppeteer, 'launch').resolves({
        newPage: newPageStub,
        close: closeBrowerStub
      })
      await createBrowserPage()
      await closeBrowser()
    })

    it('should call the close browser', () => closeBrowerStub.should.have.been.called)
    
    after(async () => {
      sandbox.restore()
    })
  })

  describe('when closing a browser that is NOT open', () => {
    let newPageStub
    let closeBrowerStub

    before(async () => {
      newPageStub = sandbox.stub().resolves({})
      closeBrowerStub = sandbox.stub().resolves({})
      sandbox.stub(puppeteer, 'launch').resolves({
        newPage: newPageStub,
        close: closeBrowerStub
      })
      
      await closeBrowser()
    })

    it('should NOT call the close browser', () => closeBrowerStub.should.not.have.been.called)
    
    after(async () => {
      sandbox.restore()
    })
  })
})