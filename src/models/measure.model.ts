import mongoose, { Schema } from 'mongoose';

enum MeasureType {
  WATER = 'WATER',
  GAS = 'GAS',
}

interface IMeasure extends Document {
  customer_code: string;
  measure_uuid: string;
  measure_datetime: Date;
  measure_type: MeasureType;
  measure_value: number;
  image_url: string;
  has_confirmed: boolean;
}

const MeasureSchema: Schema = new Schema(
  {
    customer_code: {
      type: String,
      required: true,
    },
    measure_uuid: {
      type: String,
      required: true,
      unique: true,
    },
    measure_type: {
      type: String,
      enum: MeasureType,
      required: true,
    },
    measure_value: {
      type: Number,
      required: true,
    },
    image_url: {
      type: String,
      required: true,
    },
    measure_datetime: {
      type: Date,
      required: true
    },
    has_confirmed: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    collection: 'measures',
    timestamps: true,
  }
);

const Measure = mongoose.model('Measure', MeasureSchema);

export { Measure, IMeasure };
