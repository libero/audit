import { Cli } from '@libero/migrator';
import { serviceConfig } from './config';

const cli = new Cli({
    banner: 'Libero Reviewer Audit Service: Migration tool',
    name: 'migrate',
    knexConfig: serviceConfig().knex,
    migrations: {
        path: `${__dirname}/migrations`,
        pattern: /.*\.ts/,
    },
});

cli.exec();
