import express from 'express';
import { MeasureController } from '../controllers/measure.controller';

const measureController = new MeasureController();
const router = express.Router();

router.post('/upload', measureController.upload.bind(measureController));
router.patch('/confirm', measureController.confirm.bind(measureController));
router.get('/:customer_code/list', measureController.list.bind(measureController));

export { router as measureRoute };
