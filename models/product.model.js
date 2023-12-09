const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//- name, color, variant, model

const productSchema = new Schema({
  name: { type: String },
  color: { type: String },
  variant: { type: String },
  model: { type: String },
  hsn: { type: Number },
  category: { type: Object },
  supplier: { type: Object },
  purchase_value: { type: String },
  selling_value: { type: String },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
