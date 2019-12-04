// Startup the audit service
import { InfraLogger as logger } from './logger';
import setup from './setup';
import config from 'config';

setup(config).then(app =>
    app.listen(config.port, () => {
        logger.info(`Audit service listening on port ${config.port}`);
    }),
);
