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

    eventBus = await new RabbitEventBus({ url: `amqp://${config.event.url}` }).init([LiberoEventType.userLoggedInIdentifier], 'service');
    knex = Knex(config.knex);
});

afterAll(async () => {
    await eventBus.destroy();
    await knex.destroy();
});

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
        await new Promise(resolve => setTimeout(resolve, 1400)); // this is not ideal

        const result = await knex.select('*').from('audit').where(`audit.entity`, `user:${userId}`).first();
        
        expect(result).toBeDefined();
        expect(result).toMatchObject({
            entity: `user:${userId}`,
            action: 'LOGGED_IN',
            object: 'test',
            result: 'authorized',
        });
        expect(result.created).toBeDefined();
        expect(result.occurred.toISOString()).toEqual(date.toISOString());
    });
});