import express from 'express';
import sslRouter from './ssl-checker/controller.js';
const app = express();
app.use(express.json());

app.use('/check-ssl', sslRouter);

app.listen(3000 || process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT || 3000}`);
});
