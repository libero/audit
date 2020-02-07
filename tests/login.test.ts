import * as Knex from 'knex';
import { v4 } from 'uuid';
import { RabbitEventBus, Event, EventBus } from '@libero/event-bus';
import { UserLoggedInPayload, LiberoEventType } from '@libero/event-types';
import { getServiceConfig, ConfigType } from '../src/config';

let eventBus: EventBus;
let config: ConfigType;
let knex: Knex;

beforeAll(async () => {
    config = getServiceConfig();

    // we assume that the tests are run on the host, change the config to reflect that
    (config.knex.connection as Knex.ConnectionConfig).host = 'localhost';
    config.event.url = 'localhost';

    eventBus = await new RabbitEventBus({ url: `amqp://${config.event.url}` }).init(
        [LiberoEventType.userLoggedInIdentifier],
        'service',
    );
    knex = Knex(config.knex);
});

afterAll(async () => {
    await eventBus.destroy();
    await knex.destroy();
});

const poll = (
    fn: (...args: unknown[]) => boolean | Promise<boolean>,
    timeout = 10000,
    interval = 100,
): Promise<void> => {
    const maxDate = new Date().getTime() + timeout;

    const check = async (resolve, reject) => {
        const result = await fn();

        if (result) {
            resolve(result);
        } else if (new Date().getTime() > maxDate) {
            reject(new Error(`timed out for ${fn}`));
        } else {
            setTimeout(check, interval, resolve, reject);
        }
    };

    return new Promise(check);
};

describe('login', (): void => {
    it('stores user logged in event in database', async () => {
        const date = new Date();
        const userId = v4();
        const event: Event<UserLoggedInPayload> = {
            id: v4(),
            created: date,
            eventType: LiberoEventType.userLoggedInIdentifier,
            context: {
                source: 'test',
            },
            payload: {
                name: 'name',
                userId,
                email: 'foo@example.com',
                result: 'authorized',
                timestamp: date,
            },
        };

        await eventBus.publish(event);

        let result;

        await poll(
            async (): Promise<boolean> => {
                result = await knex
                    .select('*')
                    .from('audit_log')
                    .withSchema('public')
                    .where(`object_id`, userId)
                    .first();

                return result;
            },
        );

        expect(result).toBeDefined();
        expect(result).toMatchObject({
            // eslint-disable-next-line @typescript-eslint/camelcase
            object_id: userId,
            action: 'LOGGED_IN',
            // eslint-disable-next-line @typescript-eslint/camelcase
            object_type: 'User',
        });
        expect(result.created).toBeDefined();
        expect(result.created.toISOString()).toEqual(date.toISOString());
    });
});
