import { createBrowserPage } from './puppeteer'


export async function getHTMLContent(url: string): Promise<string> {
  const page = await createBrowserPage()
  await page.goto(url)
  return await page.content()
}