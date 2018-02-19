import { createBrowserPage } from './puppeteer'
import { Page } from 'puppeteer';

export const IMAGES_DOCUMENT_SELECTOR = 'img'

export async function getHTMLContent(url: string): Promise<string> {
  const page = await createBrowserPage()
  await page.goto(url)
  return await page.content()
}

export async function savePageImages(page: Page): Promise<void> {
  await page.$$(IMAGES_DOCUMENT_SELECTOR)
}

export async function savePageCSSAndJS(page: Page): Promise<void> {
  
}