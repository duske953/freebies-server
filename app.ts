import express from 'express';
import sslRouter from './api/ssl-checker/controller.ts';
import analyzeRouter from './api/anaylze-site/controller.ts';
import cors from 'cors';
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: '*',
    credentials: true,
  }),
);

app.use('/check-ssl', sslRouter);
app.use('/analyze-site', analyzeRouter);

export default app;
