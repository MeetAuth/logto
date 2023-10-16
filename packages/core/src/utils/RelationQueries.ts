import { type KeysToCamelCase } from '@silverhand/essentials';
import { sql, type CommonQueryMethods } from 'slonik';
import snakecaseKeys from 'snakecase-keys';
import { type z } from 'zod';

type AtLeast2<T extends unknown[]> = `${T['length']}` extends '0' | '1' ? never : T;

type TableInfo<Table, TableSingular, Schema> = {
  table: Table;
  tableSingular: TableSingular;
  guard: z.ZodType<Schema, z.ZodTypeDef, unknown>;
};

type InferSchema<T> = T extends TableInfo<infer _, infer _, infer Schema> ? Schema : never;

type CamelCaseIdObject<T extends string> = KeysToCamelCase<{
  [Key in `${T}_id`]: string;
}>;

/**
 * Query class for relation tables that connect several tables by their entry ids.
 *
 * Let's say we have two tables `users` and `groups` and a relation table
 * `user_group_relations`. Then we can create a `RelationQueries` instance like this:
 *
 * ```ts
 * const userGroupRelations = new RelationQueries(pool, 'user_group_relations', Users, Groups);
 * ```
 *
 * `Users` and `Groups` are the schemas of the tables that satisfy the {@link TableInfo}
 * interface. The generated schemas in `@logto/schemas` satisfy this interface.
 *
 * To insert a new relation, we can use the {@link RelationQueries.insert} method:
 *
 * ```ts
 * await userGroupRelations.insert(['user-id-1', 'group-id-1']);
 * // Insert multiple relations at once
 * await userGroupRelations.insert(
 *   ['user-id-1', 'group-id-1'],
 *   ['user-id-2', 'group-id-1']
 * );
 * ```
 *
 * To get all entries for a specific table, we can use the {@link RelationQueries.getEntries} method:
 *
 * ```ts
 * await userGroupRelations.getEntries(Users, { groupId: 'group-id-1' });
 * ```
 *
 * This will return all entries for the `users` table that are connected to the
 * group with the id `group-id-1`.
 */
export default class RelationQueries<
  Schemas extends Array<TableInfo<string, string, unknown>>,
  Length = AtLeast2<Schemas>['length'],
> {
  protected get table() {
    return sql.identifier([this.relationTable]);
  }

  public readonly schemas: Schemas;

  /**
   * @param pool The database pool.
   * @param relationTable The name of the relation table.
   * @param relations The schemas of the tables that are connected by the relation table.
   * @see {@link TableInfo} for more information about the schemas.
   */
  constructor(
    public readonly pool: CommonQueryMethods,
    public readonly relationTable: string,
    ...schemas: Readonly<Schemas>
  ) {
    this.schemas = schemas;
  }

  /**
   * Insert new entries into the relation table.
   *
   * Each entry must contain the same number of ids as the number of relations, and
   * the order of the ids must match the order of the relations.
   *
   * @example
   * ```ts
   * const userGroupRelations = new RelationQueries(pool, 'user_group_relations', Users, Groups);
   *
   * userGroupRelations.insert(['user-id-1', 'group-id-1']);
   * // Insert multiple relations at once
   * userGroupRelations.insert(
   *   ['user-id-1', 'group-id-1'],
   *   ['user-id-2', 'group-id-1']
   * );
   * ```
   *
   * @param data Entries to insert.
   * @returns A Promise that resolves to the query result.
   */
  async insert(...data: ReadonlyArray<string[] & { length: Length }>) {
    return this.pool.query(sql`
      insert into ${this.table} (${sql.join(
        this.schemas.map(({ tableSingular }) => sql.identifier([tableSingular + '_id'])),
        sql`, `
      )})
      values ${sql.join(
        data.map(
          (relation) =>
            sql`(${sql.join(
              relation.map((id) => sql`${id}`),
              sql`, `
            )})`
        ),
        sql`, `
      )};
    `);
  }

  /**
   * Delete a relation from the relation table.
   *
   * @param data The ids of the entries to delete. The keys must be in camel case
   * and end with `Id`.
   * @returns A Promise that resolves to the query result.
   *
   * @example
   * ```ts
   * const userGroupRelations = new RelationQueries(pool, 'user_group_relations', Users, Groups);
   * userGroupRelations.delete({ userId: 'user-id-1', groupId: 'group-id-1' });
   * ```
   */
  async delete(data: CamelCaseIdObject<Schemas[number]['tableSingular']>) {
    const snakeCaseData = snakecaseKeys(data);
    return this.pool.query(sql`
      delete from ${this.table}
      where ${sql.join(
        Object.entries(snakeCaseData).map(
          ([column, value]) => sql`${sql.identifier([column])} = ${value}`
        ),
        sql` and `
      )};
    `);
  }

  /**
   * Get all entries for a specific schema that are connected to the given ids.
   *
   * @param forSchema The schema to get the entries for.
   * @param where Other ids to filter the entries by. The keys must be in camel case
   * and end with `Id`.
   * @returns A Promise that resolves an array of entries of the given schema.
   *
   * @example
   * ```ts
   * const userGroupRelations = new RelationQueries(pool, 'user_group_relations', Users, Groups);
   *
   * userGroupRelations.getEntries(Users, { groupId: 'group-id-1' });
   * ```
   */
  async getEntries<S extends Schemas[number]>(
    forSchema: S,
    where: CamelCaseIdObject<Exclude<Schemas[number]['tableSingular'], S['tableSingular']>>
  ): Promise<ReadonlyArray<InferSchema<S>>> {
    const snakeCaseWhere = snakecaseKeys(where);
    const forTable = sql.identifier([forSchema.table]);

    const { rows } = await this.pool.query<InferSchema<S>>(sql`
      select ${forTable}.*
      from ${this.table}
      join ${forTable} on ${sql.identifier([
        this.relationTable,
        forSchema.tableSingular + '_id',
      ])} = ${forTable}.id
      where ${sql.join(
        Object.entries(snakeCaseWhere).map(
          ([column, value]) => sql`${sql.identifier([column])} = ${value}`
        ),
        sql` and `
      )};
    `);

    return rows;
  }
}