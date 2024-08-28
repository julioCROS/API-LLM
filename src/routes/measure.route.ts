import express from 'express';
import { MeasureController } from '../controllers/measure.controller';

const measureController = new MeasureController();
const router = express.Router();

router.post('/upload', measureController.upload);

export { router as measureRoute };
