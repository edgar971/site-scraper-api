import { createBrowserPage } from "./puppeteer/index"
import { Page } from "puppeteer"
import { savePageImages, savePageCSSAndJS } from "./page"

export async function scrapePage(url: string): Promise<void> {
  const browserPage: Page = await createBrowserPage()
  await browserPage.goto(url)
  await savePageImages(browserPage)
  await savePageCSSAndJS(browserPage)
  await browserPage.close()
}
