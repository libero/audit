import { Cli } from '@libero/migrator';
import { getServiceConfig } from './config';

const cli = new Cli({
    banner: 'Libero Reviewer Audit Service: Migration tool',
    name: 'migrate',
    knexConfig: getServiceConfig().knex,
    migrations: {
        path: `${__dirname}/migrations`,
        pattern: /.*\.js$/,
    },
});

cli.exec();
