import * as fs from 'fs'
import * as path from 'path'

interface ImageMeta {
  placeholder?: string
  sizes?: Array<{ width: number; urlPath: string }>
}

const manifestCache = new Map<string, Record<string, ImageMeta>>()

function loadManifest(dir: string): Record<string, ImageMeta> {
  const cached = manifestCache.get(dir)
  if (cached) return cached
  try {
    const p = path.resolve(process.cwd(), dir, 'images.json')
    const data = JSON.parse(fs.readFileSync(p, 'utf-8')) as Record<string, ImageMeta>
    manifestCache.set(dir, data)
    return data
  } catch {
    // Missing manifest is fine — fall through to plain <img>.
    manifestCache.set(dir, {})
    return {}
  }
}

export interface NotionImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt?: string
  /** Where to read the image manifest from. Default `.notion-to-site`. */
  manifestDir?: string
}

/**
 * A server component that renders an image with the blur placeholder and
 * `srcSet` recorded by notion-to-site's image pipeline. If `src` is not in
 * the manifest (or the manifest is missing), it falls back to a plain
 * `<img>` so the component is always safe to use.
 *
 * ```tsx
 * import { NotionImage } from 'notion-to-site/next'
 * <NotionImage src={post.frontmatter.cover_image} alt="" className="cover" />
 * ```
 */
export function NotionImage({
  src,
  alt,
  style,
  manifestDir = '.notion-to-site',
  ...rest
}: NotionImageProps) {
  const meta = loadManifest(manifestDir)[src]

  const mergedStyle = meta?.placeholder
    ? {
        backgroundImage: `url(${meta.placeholder})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        ...style,
      }
    : style

  const srcSet = meta?.sizes
    ? meta.sizes.map((s) => `${s.urlPath} ${s.width}w`).join(', ')
    : undefined

  return <img src={src} srcSet={srcSet} alt={alt} style={mergedStyle} {...rest} />
}
