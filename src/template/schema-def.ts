import type { CreateDatabaseParameters } from '@notionhq/client'

/**
 * Property schema for a fresh blog database, passed to
 * `databases.create({ initial_data_source: { properties } })` (the Notion
 * 2025-09-03 data-source model).
 *
 * Each key is the FIRST candidate in the matching `findProperty()` list in
 * src/schema.ts, so a database created from this round-trips perfectly through
 * legacy-mode extraction. `Date` and `Cover` feed the new date/cover-from-
 * property support; `Status`/`Category`/`Language` option sets match what a
 * typical site consumes (e.g. Status "Published", categories, en/es).
 */
export const BLOG_DATA_SOURCE_PROPERTIES: NonNullable<
  NonNullable<CreateDatabaseParameters['initial_data_source']>['properties']
> = {
  Title: { title: {} },
  Slug: { rich_text: {} },
  Status: {
    select: {
      options: [
        { name: 'Draft', color: 'gray' },
        { name: 'Published', color: 'green' },
      ],
    },
  },
  Category: {
    multi_select: {
      options: [
        { name: 'Business', color: 'blue' },
        { name: 'Technology', color: 'purple' },
        { name: 'Company', color: 'orange' },
      ],
    },
  },
  Tags: { multi_select: { options: [] } },
  Language: {
    select: {
      options: [
        { name: 'en', color: 'default' },
        { name: 'es', color: 'default' },
      ],
    },
  },
  Author: { rich_text: {} },
  'SEO Title': { rich_text: {} },
  Description: { rich_text: {} },
  Date: { date: {} },
  Cover: { url: {} },
}
