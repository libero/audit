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
