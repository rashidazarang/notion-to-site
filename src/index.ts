export { NotionClient } from './core/client.js'
export { NtxRenderer, tableRowsToMarkdown } from './core/renderer.js'
export type { NtxRendererOptions } from './core/renderer.js'
export { renderRichText } from './core/rich-text.js'
export type { RenderContext } from './core/rich-text.js'
export { loadState, saveState, needsUpdate, recordPage } from './core/state.js'
export type { NtxState, PageState } from './core/state.js'
export { processImage, ImageFetchError } from './pipeline/images.js'
export type { ImageProcessOptions, ImageResult } from './pipeline/images.js'
export {
  extractComment,
  detectLanguage,
  stripMarkdownInline,
  slugify,
  resolveNotionLinks,
  stripBackLinks,
  generateToc,
  extractDescription,
  computeReadingTime,
  computeWordCount,
} from './pipeline/content.js'
export { MarkdownAdapter } from './adapters/markdown.js'
export { MdxAdapter } from './adapters/mdx.js'
export { JsonAdapter } from './adapters/json.js'
export {
  PostFrontmatterSchema,
  validateFrontmatter,
  extractProperties,
  extractPropertiesTyped,
} from './schema.js'
export type { PostFrontmatter, NotionPageProperties } from './schema.js'
export { introspectSchema } from './typegen/introspect.js'
export type { NtsSchema, NtsPropertySchema } from './typegen/introspect.js'
export { propertyToTypes } from './typegen/map.js'
export type { PropertyTypeMapping } from './typegen/map.js'
export { emitTypes } from './typegen/emit.js'
export { loadConfig } from './config.js'
export type { NtxConfig, BlockTransformer, ColorStrategy } from './types.js'
