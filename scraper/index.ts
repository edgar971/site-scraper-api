import { getHTMLContent } from "./page"

export async function scrapePage(url: string): Promise<void> {
  await getHTMLContent(url)
}