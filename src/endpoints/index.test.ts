import { Request, Response } from 'express';
import { HealthCheck } from './index';

describe('endpoints', (): void => {
    describe('HealthCheck', (): void => {
        it('is OK', () => {
            const request = ({} as unknown) as Request;
            const mockResponseJson = jest.fn();
            const response = ({
                status: jest.fn(() => ({
                    json: mockResponseJson,
                })),
            } as unknown) as Response;
            HealthCheck()(request, response);
            expect(response.status).toHaveBeenCalledTimes(1);
            expect(mockResponseJson).toHaveBeenCalledTimes(1);
            expect(response.status).toBeCalledWith(200);
            expect(mockResponseJson).toBeCalledWith({ ok: true });
        });
    });
});
