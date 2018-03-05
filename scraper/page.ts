import { load } from 'cheerio'
import { createBrowserPage } from './puppeteer'
import { Page } from 'puppeteer'

export const IMAGES_DOCUMENT_SELECTOR = 'img'
export const CSS_AND_JS_DOCUMENT_SELECTOR = 'link[rel="stylesheet"], script[src]'

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
  const htmlContent = await page.content()
  const dom = load(htmlContent)
  const linkElements = dom(CSS_AND_JS_DOCUMENT_SELECTOR)

  return linkElements.map(function srcSelector() {
    const cssOrJsElement = cheerio(this)
    return cssOrJsElement.attr('src') || cssOrJsElement.attr('href')
  }).get()
}