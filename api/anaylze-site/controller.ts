import express from 'express';
import { analyzeSite } from './service/analyzeSite.ts';
const router = express.Router();

router.post('/', async (req, res) => {
  let { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }
  url = url.includes('https://')
    ? url
    : url.includes('http://')
      ? url.replace('http://', 'https://')
      : `https://${url}`;
  const data = await analyzeSite(url);
  res.status(200).json(data);
});

export default router;
