const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const inWardSchema = new Schema({
  imei_number: { 
    type: String, 
    unique: true
  },
  product: { type: Object },
  purchase_value: { type: String },
  reference_invoice_number: {type: String},
  quantity: { type: Number },
  selling_value: { type: String },
  gst_percentage: { type: String },
  branch: { type: String },
  to_branch: { type: String},
  doi: { type: String },
  status: { type: String, default: 'inward' },
  type: { type: String, default: 'first' },
  is_sale: { type: Boolean, default: false},
});

const InWard = mongoose.model("InWard", inWardSchema);

module.exports = InWard;
