import { load } from 'cheerio'
import { createBrowserPage } from './puppeteer'
import { Page } from 'puppeteer'

export const IMAGES_DOCUMENT_SELECTOR = 'img'
export const CSS_AND_JS_DOCUMENT_SELECTOR = 'link[rel="stylesheet"], script'

export async function getHTMLContent(url: string): Promise<string> {
  const page = await createBrowserPage()
  await page.goto(url)
  return await page.content()
}

export async function getPageImageUrls(page: Page): Promise<string[]> {
  const htmlContent = await page.content()
  const dom = load(htmlContent)
  const linkElements = dom(IMAGES_DOCUMENT_SELECTOR)

  return linkElements.map(function srcSelector() {
    return cheerio(this).attr('src')
  }).get()
}

export async function getPageCssAndJsUrls(page: Page): Promise<string[]> {
  // const results = await page.$$(CSS_AND_JS_DOCUMENT_SELECTOR)
  // const urls = Promise.all(images.map(async image => await image.jsonValue()))
  return null
}