/**
 * Database classification — given an introspected `NtsSchema`, infer the
 * *kind* of database (blog, people, projects, …) and the *role* each property
 * plays (which one is the date, cover, status, slug, …). This runs on every
 * sync so consumers can sort/route content without hand-mapping every database.
 *
 * Pure and heuristic: it reads only property names + types, never page data.
 */
import type { NtsSchema, NtsPropertySchema } from './typegen/introspect.js'

export interface FieldRoles {
  title: string | null
  slug: string | null
  date: string | null
  cover: string | null
  status: string | null
  description: string | null
  tags: string | null
  category: string | null
  author: string | null
  language: string | null
}

export type DatabaseKind =
  | 'blog'
  | 'people'
  | 'projects'
  | 'tasks'
  | 'docs'
  | 'changelog'
  | 'events'
  | 'products'
  | 'generic'

export interface DatabaseClassification {
  kind: DatabaseKind
  /** 0..1 confidence in `kind`. */
  confidence: number
  /** Human-readable reasons the kind was chosen. */
  signals: string[]
  /** The detected role → property-name mapping. */
  roles: FieldRoles
}

const lc = (s: string) => s.toLowerCase()

function firstName(
  props: NtsPropertySchema[],
  pred: (p: NtsPropertySchema) => boolean,
): string | null {
  return props.find(pred)?.name ?? null
}

/** Detect which property plays each common content role. */
export function inferRoles(schema: NtsSchema): FieldRoles {
  const P = schema.properties
  const named = (re: RegExp, types?: string[]) =>
    firstName(P, (p) => (!types || types.includes(p.type)) && re.test(lc(p.name)))

  return {
    title: schema.titleProperty || firstName(P, (p) => p.type === 'title'),
    slug: named(/^(slug|url|permalink|path)$/, ['rich_text', 'url']),
    date:
      named(/(^date$|published|publish|posted|released|release date)/, ['date']) ||
      firstName(P, (p) => p.type === 'date'),
    cover: named(/(cover|thumbnail|featured|image|banner|hero|photo)/, ['url', 'files']),
    status: firstName(
      P,
      (p) => (p.type === 'status' || p.type === 'select') && /(status|state|stage)/.test(lc(p.name)),
    ),
    description: named(/(description|summary|excerpt|subtitle|abstract|tagline)/, ['rich_text']),
    tags: firstName(
      P,
      (p) => p.type === 'multi_select' && /(tag|topic|keyword)/.test(lc(p.name)),
    ),
    category: firstName(
      P,
      (p) =>
        (p.type === 'select' || p.type === 'multi_select') &&
        /(category|categories|section|collection)/.test(lc(p.name)),
    ),
    author:
      firstName(
        P,
        (p) =>
          (p.type === 'people' || p.type === 'rich_text') &&
          /(author|writer|owner|assignee|created by|by)/.test(lc(p.name)),
      ) || firstName(P, (p) => p.type === 'people'),
    language: named(/(language|lang|locale|idioma)/, ['select', 'rich_text']),
  }
}

/** Classify the database's kind from its property names + types. */
export function classifyDatabase(schema: NtsSchema): DatabaseClassification {
  const P = schema.properties
  const roles = inferRoles(schema)
  const allNames = P.map((p) => lc(p.name)).join(' ')
  const has = (re: RegExp) => re.test(allNames)

  const hasPeopleProp = P.some((p) => p.type === 'people')
  const hasEmail = P.some((p) => p.type === 'email') || has(/\bemail\b/)
  const hasPhone = P.some((p) => p.type === 'phone_number') || has(/phone/)
  const hasDate = !!roles.date
  const hasStatus = !!roles.status
  const hasTagsOrCat = !!roles.tags || !!roles.category
  const hasAuthor = !!roles.author
  const hasVersion = has(/version|release/)
  const hasDue = has(/due|deadline|priority/)
  const hasLocation = has(/location|venue|place|address/)
  const hasEventDate = P.some((p) => p.type === 'date' && /(start|end|when|event|schedule)/.test(lc(p.name)))
  const hasPrice = has(/price|cost|\bsku\b|inventory|stock/)

  const cand: Array<{ kind: DatabaseKind; score: number; why: string[] }> = []
  const push = (kind: DatabaseKind, score: number, why: string[]) => {
    if (score > 0) cand.push({ kind, score, why })
  }

  push('people', (hasPeopleProp ? 0.3 : 0) + (hasEmail ? 0.3 : 0) + (hasPhone ? 0.2 : 0) + (has(/team|member|staff|contact|person/) ? 0.15 : 0),
    [hasPeopleProp && 'people field', hasEmail && 'email', hasPhone && 'phone'].filter(Boolean) as string[])
  push('tasks', (hasStatus ? 0.25 : 0) + (hasDue ? 0.4 : 0) + (hasPeopleProp ? 0.2 : 0),
    [hasStatus && 'status', hasDue && 'due/priority', hasPeopleProp && 'assignee'].filter(Boolean) as string[])
  push('projects', (hasStatus ? 0.3 : 0) + (hasPeopleProp ? 0.2 : 0) + (hasDate ? 0.1 : 0) + (has(/project|milestone|initiative/) ? 0.25 : 0),
    [hasStatus && 'status', has(/project|milestone|initiative/) && 'project naming'].filter(Boolean) as string[])
  push('changelog', (hasVersion ? 0.5 : 0) + (hasDate ? 0.2 : 0) + (has(/changelog/) ? 0.2 : 0),
    [hasVersion && 'version', has(/changelog/) && 'changelog naming'].filter(Boolean) as string[])
  push('events', (hasEventDate ? 0.4 : 0) + (hasLocation ? 0.35 : 0),
    [hasEventDate && 'start/end date', hasLocation && 'location'].filter(Boolean) as string[])
  push('products', (hasPrice ? 0.5 : 0) + (roles.cover ? 0.1 : 0),
    [hasPrice && 'price/sku'].filter(Boolean) as string[])
  push('blog', (hasDate ? 0.3 : 0) + (hasTagsOrCat ? 0.25 : 0) + (hasAuthor ? 0.2 : 0) + (hasStatus ? 0.15 : 0) + (roles.description ? 0.1 : 0),
    [hasDate && 'date', hasTagsOrCat && 'tags/category', hasAuthor && 'author', hasStatus && 'status'].filter(Boolean) as string[])
  push('docs', (roles.category ? 0.2 : 0) + (!hasDate && !hasAuthor ? 0.15 : 0) + (has(/doc|guide|wiki|knowledge|article|page/) ? 0.3 : 0),
    [roles.category && 'category', has(/doc|guide|wiki|knowledge/) && 'docs naming'].filter(Boolean) as string[])

  cand.sort((a, b) => b.score - a.score)
  const top = cand[0]
  if (!top || top.score < 0.3) {
    return { kind: 'generic', confidence: 0, signals: [], roles }
  }
  return { kind: top.kind, confidence: Math.min(1, Number(top.score.toFixed(2))), signals: top.why, roles }
}
