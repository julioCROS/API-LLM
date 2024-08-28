import express from 'express';
import { MeasureController } from '../controllers/measure.controller';

const measureController = new MeasureController();
const router = express.Router();

router.post('/upload', measureController.upload);
router.patch('/confirm', measureController.confirm);
router.get('/:customer_code/list', measureController.list);

export { router as measureRoute };
