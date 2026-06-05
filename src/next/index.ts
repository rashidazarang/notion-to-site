// `withNotion` lives in the build-time-only subpath `notion-to-site/next/plugin`.
// Keeping it out of this runtime barrel means pages that import getAllPages /
// NotionContent don't transitively pull the sync engine (config loader, sharp,
// @notionhq/client) into their server bundle or Next's file trace.
export { getAllPages, getPageBySlug } from './api.js'
export type { ContentPage } from './api.js'
export { NotionContent } from './NotionContent.js'
export type { NotionContentProps } from './NotionContent.js'
export { NotionImage } from './NotionImage.js'
export type { NotionImageProps } from './NotionImage.js'
