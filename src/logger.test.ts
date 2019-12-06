import Logger, { InfraLogger, DomainLogger } from './logger';

describe('logger', () => {
    it('Logger has no bindings', () => {
        const loggerBindings = Logger.bindings();
        expect(loggerBindings).toEqual({});
    });
    it('InfraLogger has service set to audit and realm set to infra on bindings', () => {
        const loggerBindings = InfraLogger.bindings();
        expect(loggerBindings).toEqual({ service: 'audit', realm: 'infra' });
    });
    it('DomainLogger has service set to audit and realm set to domain on bindings', () => {
        const loggerBindings = DomainLogger.bindings();
        expect(loggerBindings).toEqual({ service: 'audit', realm: 'domain' });
    });
});
