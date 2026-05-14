/**
 * Schema introspection — turns a Notion data source's raw property
 * configuration into a normalized internal schema (`NtsSchema`) that the type
 * generator and the typed property extractor both consume.
 */

export interface NtsPropertySchema {
  /** The property's name in Notion — used verbatim as the output key. */
  name: string
  /** The Notion property type, e.g. `'title'`, `'select'`, `'relation'`. */
  type: string
  /** For `select` / `multi_select` / `status`: the option names, in order. */
  options?: string[]
  /** For `relation`: the related database / data source. */
  relation?: { databaseId?: string; dataSourceId?: string }
  /** For `rollup`: the aggregation function. */
  rollupFunction?: string
}

export interface NtsSchema {
  dataSourceId: string
  /** The name of the `title` property — every Notion database has exactly one. */
  titleProperty: string
  properties: NtsPropertySchema[]
}

/**
 * Normalizes a data source's raw `properties` map (from
 * `NotionClient.retrieveDataSourceSchema`) into an `NtsSchema`. Pure — the
 * network fetch happens in the caller.
 */
export function introspectSchema(
  dataSourceId: string,
  rawProperties: Record<string, any>,
): NtsSchema {
  const properties: NtsPropertySchema[] = []
  let titleProperty = 'Name'

  for (const [name, config] of Object.entries(rawProperties)) {
    const type: string = config?.type ?? 'rich_text'
    const prop: NtsPropertySchema = { name, type }

    if (type === 'title') {
      titleProperty = name
    } else if (type === 'select' || type === 'status' || type === 'multi_select') {
      prop.options = (config[type]?.options ?? []).map((o: any) => o.name)
    } else if (type === 'relation') {
      prop.relation = {
        databaseId: config.relation?.database_id,
        dataSourceId: config.relation?.data_source_id,
      }
    } else if (type === 'rollup') {
      prop.rollupFunction = config.rollup?.function
    }

    properties.push(prop)
  }

  return { dataSourceId, titleProperty, properties }
}
