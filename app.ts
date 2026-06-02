import express from 'express';
import cors from 'cors';
import limiter from './utils/rateLimiter.ts';
import appRouter from './utils/router.ts';
import analyzeSiteRouter from './api/anaylze-site/controller.ts';
import analyzeOgTagsRouter from './api/analyze-ogTags/controller.ts';
import checkSslRouter from './api/ssl-checker/controller.ts';
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

appRouter.use('/analyze-site', analyzeSiteRouter);
appRouter.use('/analyze-og-tags', analyzeOgTagsRouter);
appRouter.use('/check-ssl', checkSslRouter);
app.use('/api/v1', appRouter);

export default app;

// app.listen(3000, () => {
//   console.log('Server is running on port 3000');
// });
