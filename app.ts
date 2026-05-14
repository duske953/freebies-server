import express from 'express';
import sslRouter from './api/ssl-checker/controller.ts';
import analyzeRouter from './api/anaylze-site/controller.ts';
import cors from 'cors';
import limiter from './utils/rateLimiter.ts';
const app = express();

// rate limiter
app.use(limiter);

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cors
app.use(
  cors({
    origin: '*',
    credentials: true,
  }),
);

// routes
app.use('/check-ssl', sslRouter);
app.use('/analyze-site', analyzeRouter);

// server
export default app;
