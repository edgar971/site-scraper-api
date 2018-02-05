import * as puppeteer from 'puppeteer'
import { Browser, Page } from 'puppeteer'
import { isNullOrUndefined } from 'util';

let browser: Browser

export async function createBrowserPage(): Promise<Page> {
  if(isNullOrUndefined(browser)) {
    browser = await puppeteer.launch()
  }
  
  return await browser.newPage()
}

export async function closeBrowser(): Promise<void> {
  if(!isNullOrUndefined(browser)) {
    await browser.close()
    browser = null
  }
}