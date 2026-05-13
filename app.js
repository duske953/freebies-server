import express from 'express';
import sslRouter from './ssl-checker/controller.js';
import analyzeRouter from './anaylze-site/controller.ts';
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

app.listen(process.env.PORT || 4000, () => {
  console.log(`Server started on port ${process.env.PORT || 4000}`);
});
