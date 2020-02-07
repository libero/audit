# Database Schema

In order to achieve parity we are initially using the xpub schema.
The new schema below is where we'd like to be heading.

## New Schema

```{js}
import * as Knex from 'knex';

export default {
    up(knex: Knex): Knex.SchemaBuilder {
        return knex.schema.createTable('audit', (table: Knex.TableBuilder) => {
            table.string('entity');
            table.string('action');
            table.string('object');
            table.string('result');
            table.timestamp('occurred');
            table.timestamp('created').defaultTo(knex.fn.now());
        });
    },

    down(knex: Knex): Knex.SchemaBuilder {
        return knex.schema.dropTable('audit');
    },
};
```
