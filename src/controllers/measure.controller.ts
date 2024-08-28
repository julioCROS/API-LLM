import { Request, Response } from 'express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

import { uploadMeasureDto } from '../dtos/uploadMeasure.dto';
import { confirmMeasureDto } from '../dtos/confirmMeasure.dto';
import { measureRepository } from '../repositories/measure.repositories';

class MeasureController {
  async upload(request: Request, response: Response) {
    const dto = plainToClass(uploadMeasureDto, request.body);
    const isValid = await this.validateAndHandleErrors(dto, response);
    if (!isValid) return;

    const result = await measureRepository.upload(request.body);
    response.status(200).send(result);
  }

  async confirm(request: Request, response: Response) {
    const dto = plainToClass(confirmMeasureDto, request.body);
    const isValid = await this.validateAndHandleErrors(dto, response);
    if (!isValid) return;

    const result = await measureRepository.confirm(request.body);
    response.status(200).send(result);
  }

  async list(request: Request, response: Response) {
    const result = await measureRepository.list(request.params.customer_code, request.query.measure_type as string);
    response.status(200).send(result);
  }

  private async validateAndHandleErrors(dto: any, response: Response) {
    const errors = await validate(dto);
    if (errors.length > 0) {
      response.status(400).send({
        error_code: 'INVALID_DATA',
        error_description: errors,
      });
      return false;
    }
    return true;
  }
}

export { MeasureController };
