import { Request, Response } from 'express';

export type Endpoint = () => (req: Request, res: Response) => void;

export const HealthCheck: Endpoint = () => (_req: Request, res: Response): void => {
    res.status(200).json({ ok: true });
};
