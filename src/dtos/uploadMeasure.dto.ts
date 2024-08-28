import 'reflect-metadata';
import { IsString, IsEnum, IsDate, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

class UploadMeasureDto {
  @IsString()
  @IsNotEmpty()
  image!: string;

  @IsString()
  @IsNotEmpty()
  customer_code!: string;

  @Type(() => Date)
  @IsDate()
  measure_datetime!: Date

  @IsEnum(['WATER', 'GAS'])
  measure_type!: 'WATER' | 'GAS';
}

export const uploadMeasureDto = UploadMeasureDto;
