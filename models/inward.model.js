const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const inWardSchema = new Schema({
  imei_number: { 
    type: String, 
    unique: true
  },
  product: { type: Object },
  purchase_value: { type: String },
  quantity: { type: Number },
  selling_value: { type: String },
  gst_percentage: { type: String },
  branch: { type: String },
  doi: { type: String },
  type: { type: String, default: 'first' },
  is_sale: { type: Boolean, default: false},
});

const InWard = mongoose.model("InWard", inWardSchema);

module.exports = InWard;
