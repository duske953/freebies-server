import express from 'express';
import checkSSL from './model.ts';
const router = express.Router();

router.post('/', async (req, res) => {
  const { url } = req.body;
  const host = url
    .replace('https://', '')
    .replace('http://', '')
    .replace('www.', '')
    .split('/')[0];
  const result = await checkSSL(host);
  res.status(200).json(result);
});

export default router;
