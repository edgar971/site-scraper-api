export interface Site {
  id?: number,
  url: string,
  directory?: string,
  base_path?: string,
  title?: string,
  screenshot?: string,
  entire_site: boolean,
  processed?: boolean,
  created_at?: Date
}