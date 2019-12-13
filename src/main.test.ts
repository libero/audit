import App from './app';
import main from './main';

jest.mock('./logger');
jest.mock('./config', () => ({
    getServiceConfig: jest.fn().mockImplementation(() => ({
        event: {
            url: 'eventurl',
        },
    })),
}));
jest.mock('./app');

describe('main', (): void => {
    let app;

    beforeEach(() => {
        app = {
            startup: jest.fn(),
            shutdown: jest.fn(),
        };
        (App as jest.Mock).mockImplementation(() => app);
    });

    it('creates and configures App', async () => {
        await main();

        expect(app.startup).toHaveBeenCalledTimes(1);
    });
});
