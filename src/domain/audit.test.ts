import { AuditController } from './audit';

describe('Audit controller', () => {
    it('should add a log item', () => {
        const repo = {
            putLog: jest.fn(),
        };
        const controller = new AuditController(repo);
        const date = new Date();
        const item = {
            entity: 'foo',
            action: 'bar',
            object: 'baz',
            occurred: date,
        };

        controller.recordAudit(item);
        expect(repo.putLog).toHaveBeenCalledTimes(1);
        expect(repo.putLog).toHaveBeenCalledWith({
            entity: 'foo',
            action: 'bar',
            object: 'baz',
            occurred: date,
        });
    });
});
