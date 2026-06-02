import express from 'express';
import analyzeOgTags from './service.ts';
import cleanUrl from '../../utils/cleanUrl.ts';

const router = express.Router();

router.post('/', async (req, res) => {
  let { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }
  url = cleanUrl(url);
  const data = await analyzeOgTags(url);
  res.status(200).json(data);
});

export default router;
