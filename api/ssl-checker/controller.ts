import checkSSL from './model.ts';
import cleanUrl from '../../utils/cleanUrl.ts';
import express from 'express';
import type { Request, Response } from 'express';
const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });
  const host = cleanUrl(url);
  const result = await checkSSL(host);
  res.status(200).json(result);
});

export default router;
