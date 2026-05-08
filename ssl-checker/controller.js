import express from 'express';
import checkSSL from './model.js';
const router = express.Router();

router.post('/', async (req, res) => {
  const { url } = req.body;
  const host = url
    .replace('https://', '')
    .replace('http://', '')
    .replace('www.', '')
    .split('/')[0];
  const result = await checkSSL(host);
  res.json(result);
});

export default router;
