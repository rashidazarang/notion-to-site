/**
 * The single source of truth for mapping a Notion property type to a
 * TypeScript type and a matching Zod expression. Used by the type generator
 * (`emit.ts`) and mirrored by the typed property extractor (`schema.ts`).
 */
import type { NtsPropertySchema } from './introspect.js'

export interface PropertyTypeMapping {
  /** A TypeScript type expression, e.g. `"string"` or `'"Draft" | "Done"'`. */
  ts: string
  /** A Zod expression, e.g. `"z.string()"`. */
  zod: string
}

const quote = (s: string) => JSON.stringify(s)

export function propertyToTypes(prop: NtsPropertySchema): PropertyTypeMapping {
  switch (prop.type) {
    case 'title':
    case 'rich_text':
    case 'url':
    case 'email':
    case 'phone_number':
      return { ts: 'string', zod: 'z.string()' }

    case 'number':
      return { ts: 'number | null', zod: 'z.number().nullable()' }

    case 'checkbox':
      return { ts: 'boolean', zod: 'z.boolean()' }

    case 'select':
    case 'status': {
      const opts = prop.options ?? []
      if (opts.length === 0) return { ts: 'string | null', zod: 'z.string().nullable()' }
      const union = opts.map(quote).join(' | ')
      return { ts: `${union} | null`, zod: `z.enum([${opts.map(quote).join(', ')}]).nullable()` }
    }

    case 'multi_select': {
      const opts = prop.options ?? []
      if (opts.length === 0) return { ts: 'string[]', zod: 'z.array(z.string())' }
      const union = opts.map(quote).join(' | ')
      return { ts: `(${union})[]`, zod: `z.array(z.enum([${opts.map(quote).join(', ')}]))` }
    }

    case 'date':
      return {
        ts: '{ start: string; end: string | null } | null',
        zod: 'z.object({ start: z.string(), end: z.string().nullable() }).nullable()',
      }

    case 'people':
    case 'files':
      return { ts: 'string[]', zod: 'z.array(z.string())' }

    case 'relation':
      // Relations are always page IDs. Resolving them to titles/slugs is a
      // deliberate non-goal — it invites cross-data-source recursion.
      return { ts: 'string[]', zod: 'z.array(z.string())' }

    case 'rollup':
      // A rollup's result type is not statically knowable from the schema.
      return { ts: 'unknown', zod: 'z.unknown()' }

    case 'formula':
      // A formula's result type is not knowable from the schema alone.
      return {
        ts: 'string | number | boolean | null',
        zod: 'z.union([z.string(), z.number(), z.boolean(), z.null()])',
      }

    case 'created_time':
    case 'last_edited_time':
    case 'created_by':
    case 'last_edited_by':
      return { ts: 'string', zod: 'z.string()' }

    case 'unique_id':
      return {
        ts: '{ prefix: string | null; number: number | null } | null',
        zod: 'z.object({ prefix: z.string().nullable(), number: z.number().nullable() }).nullable()',
      }

    case 'button':
      // Buttons trigger actions in the Notion UI; they expose no readable value.
      return { ts: 'null', zod: 'z.null()' }

    case 'verification':
      return {
        ts: '{ state: string; verified_by: string | null; date: { start: string; end: string | null } | null } | null',
        zod: 'z.object({ state: z.string(), verified_by: z.string().nullable(), date: z.object({ start: z.string(), end: z.string().nullable() }).nullable() }).nullable()',
      }

    default:
      return { ts: 'unknown', zod: 'z.unknown()' }
  }
}
