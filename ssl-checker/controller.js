import express from 'express';
import checkSSL from './model.js';
const router = express.Router();

router.post('/', async (req, res) => {
  const { host } = req.body;
  const result = await checkSSL(host);
  res.json(result);
});

export default router;
