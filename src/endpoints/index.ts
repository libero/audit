import { Request, Response } from 'express';

export type Endpoint = () => (req: Request, res: Response) => void;

export const HealthCheck: Endpoint = () => (_req: Request, res: Response): void => {
    console.log('Im up and running!!!!!!');
    res.status(200).json({ ok: true });
};
