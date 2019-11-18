import { Request, Response } from 'express';

export type Endpoint = () => (req: Request, res: Response) => void;

// tslint:disable-next-line: variable-name
export const HealthCheck: Endpoint = () => (_req: Request, res: Response): void => {
    res.status(200).json({ ok: true });
};
