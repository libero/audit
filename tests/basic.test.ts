import { v4 } from 'uuid';
import { MockEventBus, Event } from '@libero/event-bus';
import { ConfigType } from '../src/config';
import { UserLoggedInPayload, LiberoEventType } from '@libero/event-types';
import App from '../src/app';

let app: App;
const eventBus = new MockEventBus();
const bootstrap = async (): Promise<void> => {
    const config: ConfigType = {
        port: 3004,
        event: {
            url: 'localhost'
        },
        knex: {
            client: 'pg',
            connection: {
                host: 'localhost',
                database: 'postgres',
                user: 'postgres',
                password: 'postgres',
                port: 5432,
            },
        }
    };

    app = new App(config, eventBus);

    app.startup();
};

beforeAll(async () => {
    bootstrap();
});

afterAll(async () => {
    app.shutdown();
})

describe('audit', (): void => {
    it('stores user logged in event in database', async () => {
        const date = new Date();
        const event: Event<UserLoggedInPayload> = {
            id: v4(),
            created: date,
            eventType: LiberoEventType.userLoggedInIdentifier,
            context: {
                source: 'test',
            },
            payload: {
                name: 'name',
                userId: 'user_Id',
                email: 'foo@example.com',
                result: 'authorized',
                timestamp: date,
            },
        };

        await eventBus.publish(event);

        const knex = app.getKnex();
        const result = await knex.table('audit').whereExists(knex.select('*').from('audit').whereRaw('audit.entity = \'user:user_Id\''));

        expect(result).toHaveLength(1);
        expect(result[0].occurred.toISOString()).toEqual(date.toISOString());
    });
});