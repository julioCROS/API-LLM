import { Measure } from '../models/measure.model';
import { gemini } from '../gemini.config';
import { generateUuid, handleMeasureNumericValue, isSameMonth } from '../utils';

const imgbbUploader = require('imgbb-uploader');

class MeasureRepository {
  async upload(request: any) {
    const prompt = 'Read the measure of the ' + request.measure_type + ' in the image. Give me just the value.';

    if (await this.isMeasureMonthAlreadyExists(request)) {
      return {
        error_code: 'DOUBLE_REPORT',
        error_description: 'Leitura do mês já realizada',
      }
    }

    const base64String = request.image.split(';base64,').pop()?.replace(/\s/g, '') as string;

    try {
      const result = await gemini.generateContent([prompt,
        {
          inlineData: {
            data: base64String,
            mimeType: 'image/jpeg',
          }
        }
      ]);


      const measure_value = handleMeasureNumericValue(result.response.text());
      const measure_uuid = generateUuid();
      const image_url = await this.uploadImageToImgBB(base64String, measure_uuid);

      if (!image_url) {
        return {
          error_code: 'IMAGE_UPLOAD_FAILED',
          error_description: 'Falha ao enviar a imagem para o servidor',
        }
      }

      const measure = new Measure({
        customer_code: request.customer_code,
        measure_uuid: measure_uuid,
        measure_datetime: request.measure_datetime,
        measure_type: request.measure_type,
        measure_value: measure_value,
        image_url: image_url,
        has_confirmed: false,
      });

      await measure.save();

      return {
        image_url: image_url,
        measure_value: measure_value,
        measure_uuid: measure_uuid,
      };
    } catch (error) {
      console.log(error);
    }
  }

  private async isMeasureMonthAlreadyExists(request: any) {

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

  private async uploadImageToImgBB(image: string, measure_uuid: string) {
    const imgbbOptions = {
      apiKey: process.env.IMGBB_API_KEY,
      base64string: image,
      name: `${measure_uuid}_${Date.now()}`
    };

    try {
      const response = await imgbbUploader(imgbbOptions);
      return response.url;
    } catch (error) {
      console.error("Failed to upload image to ImgBB:", error);
      return undefined;
    }
  }

  async confirm(request: any) {
    const measure = await Measure.findOne({
      measure_uuid: request.measure_uuid,
    });

    if (!measure) {
      return {
        error_code: 'MEASURE_NOT_FOUND',
        error_description: 'Leitura não encontrada',
      };
    }

    if (measure.has_confirmed) {
      return {
        error_code: 'CONFIRMATION_DUPLICATE',
        error_description: 'Leitura já confirmada',
      };
    }

    measure.has_confirmed = true;
    measure.measure_value = request.confirmed_value;

    await measure.save();

    return {
      success: true,
    };
  }

  async list(customer_code: string, measure_type: string) {
    measure_type = measure_type.toUpperCase();

    if (measure_type && !['WATER', 'GAS'].includes(measure_type)) {
      return {
        error_code: 'INVALID_TYPE',
        error_description: 'Tipo de medição não permitida',
      };
    }

    const measures = await Measure.find({
      customer_code: customer_code,
      measure_type: measure_type,
    });

    if (!measures || measures.length === 0) {
      return {
        error_code: 'MEASURE_NOT_FOUND',
        error_description: 'Nenhuma leitura encontrada',
      };
    }

    return {
      customer_code: customer_code,
      measures: measures.map(measure => {
        return {
          measure_uuid: measure.measure_uuid,
          measure_datetime: measure.measure_datetime,
          measure_type: measure.measure_type,
          has_confirmed: measure.has_confirmed,
          image_url: measure.image_url,
        };
      })
    }
  }
}

export const measureRepository = new MeasureRepository();