const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const inWardSchema = new Schema({
  imei_number: { type: String },
  product: { type: Object },
  purchase_value: { type: String },
  selling_value: { type: String },
  gst_percentage: { type: String },
  branch: { type: String },
  doi: { type: String },
  type: { type: String, default: 'first' },
});

const InWard = mongoose.model("InWard", inWardSchema);

module.exports = InWard;
