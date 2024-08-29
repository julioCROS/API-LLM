import 'reflect-metadata';
import { IsString, IsEnum, IsDate, IsNotEmpty } from 'class-validator';
import { IsBase64 } from '../validators/is-base64.validator';
import { Type } from 'class-transformer';

class UploadMeasureDto {
  @IsString()
  @IsNotEmpty()
  @IsBase64({ message: 'Image must be a valid Base64 string' })
  image!: string;

  @IsString()
  @IsNotEmpty()
  customer_code!: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  measure_datetime!: Date

  @IsEnum(['WATER', 'GAS'])
  @IsNotEmpty()
  measure_type!: 'WATER' | 'GAS';
}

export const uploadMeasureDto = UploadMeasureDto;
