import { Measure } from '../models/measure.model';
import { gemini } from '../gemini.config';
import { generate_uuid, handleMeasureValue, isSameMonth } from '../utils';

class MeasureRepository {
  async upload(request: any) {
    const prompt = 'Read the measure of the ' + request.measure_type + ' in the image. Give me just the value.';

    if (await this.isMeasureMonthAlreadyExists(request)) {
      return {
        error_code: 'DOUBLE_REPORT',
        error_description: 'Leitura do mês já realizada',
      }
    }

    try {
      const result = await gemini.generateContent([prompt,
        {
          inlineData: {
            data: request.image,
            mimeType: 'image/jpeg',
          }
        }
      ]);


      const measure_value = handleMeasureValue(result.response.text());
      const measure_uuid = generate_uuid();

      const measure = new Measure({
        customer_code: request.customer_code,
        measure_uuid: measure_uuid,
        measure_datetime: request.measure_datetime,
        measure_type: request.measure_type,
        measure_value: measure_value,
        image_url: '-',
        has_confirmed: false,
      });

      await measure.save();

      return {
        measure_value: measure_value,
        measure_uuid: measure_uuid,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async isMeasureMonthAlreadyExists(request: any) {

    const customerMeasures = await Measure.find({
      customer_code: request.customer_code as string,
      measure_type: request.measure_type as string,
    });

    if (!customerMeasures) {
      return false;
    }

    const measure_datetime = new Date(request.measure_datetime);
    return customerMeasures.some(measure => isSameMonth(measure.measure_datetime as Date, measure_datetime));
  }

}

export const measureRepository = new MeasureRepository();