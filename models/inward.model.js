const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const inWardSchema = new Schema({
   // name, imei_number, model, variant, color, purchase_value, selling_value, 
   // discount, branch, category, doi
  name: { type: String },
  imei_number: { type: String },
  model: { type: String },
  variant: { type: String },
  color: { type: String },
  purchase_value: { type: String },
  selling_value: { type: String },
  discount: { type: String },
  branch: { type: String },
  category: { type: String },
  doi: { type: String },
});

const InWard = mongoose.model("InWard", inWardSchema);

module.exports = InWard;
