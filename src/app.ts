import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { measureRoute } from './routes/measure.route';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/', measureRoute);
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

mongoose.connect(process.env.MONGO_DB_CONNECTION as string);

export { app };