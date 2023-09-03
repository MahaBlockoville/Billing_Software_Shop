const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//- name, color, variant, model

const productSchema = new Schema({
  name: { type: String },
  color: { type: String },
  variant: { type: String },
  model: { type: String },
  category: { type: Object },
  supplier: { type: Object }
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
