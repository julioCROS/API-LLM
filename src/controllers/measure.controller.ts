import { Request, Response } from 'express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { uploadMeasureDto } from '../dtos/uploadMeasure.dto';
import { measureRepository } from '../repositories/measure.repositories';

class MeasureController {

  async upload(request: Request, response: Response) {

    const dto = plainToClass(uploadMeasureDto, request.body);
    const errors = await validate(dto);
    if(errors.length > 0) {
      response.status(400).send({
        error_code: 'INVALID_DATA',
        error_description: errors,
      })
      return;
    }

    const result = await measureRepository.upload(request.body);
    response.status(200).send(result);
  }
}

export { MeasureController };
