import express from 'express';
import sslRouter from './ssl-checker/controller.js';
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/check-ssl', sslRouter);

app.listen(process.env.PORT || 4000, () => {
  console.log(`Server started on port ${process.env.PORT || 4000}`);
});
