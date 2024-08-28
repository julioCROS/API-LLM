import 'reflect-metadata';
import { IsString, IsInt, IsNotEmpty } from 'class-validator';

class ConfirmMeasureDto {
  @IsString()
  @IsNotEmpty()
  measure_uuid!: string;

  @IsInt()
  @IsNotEmpty()
  confirmed_value!: string;
}

export const confirmMeasureDto = ConfirmMeasureDto;

