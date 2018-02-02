import sql from 'sql-template-strings'
import connect from '../postgres'
import { Site } from '../interfaces'
import { isNullOrUndefined } from 'util';

export async function saveSite(site: Site) { 
  const query = sql`
  INSERT INTO sites (
    url,
    directory,
    base_path,
    title,
    screenshot,
    entire_site,
    processed
  ) VALUES (
    ${site.url},
    ${site.directory},
    ${site.base_path},
    ${site.title},
    ${site.screenshot},
    ${site.entire_site},
    ${site.processed}
  )
  RETURNING id
  `
  const results = await connect().query(query)
  return results[0].id
}

export async function getSite(siteId: number): Promise<Site> {
  const query = sql`SELECT * from sites WHERE id = ${siteId}`
  const results = await connect().query(query)

  if(isNullOrUndefined(results[0])) {
    return null
  }

  return <Site> {
    ...results[0]
  }
}

export async function getSites(): Promise<Site[]> {
  const query = sql`SELECT * from sites`
  return await connect().any(query)
}

export async function deleteSite(siteId: number) {
  const query = sql`DELETE FROM sites WHERE id = ${siteId}`
  await connect().query(query)
}