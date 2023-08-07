import { Schema, model } from 'mongoose';

const schema = new Schema({
    code: {
      type: String,
      default: Date.now,
    },purchase_datetime: {
      type: Date,
    default: Date.now,
    },amount: {
      type: Number,
      required: true,
     
    },purchaser: {
      type: String,
      max: 100,
    }
  }, {versionKey: false});
  export const TicketModel = model('tickets', schema);