const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//- name, company_name, contact_person, contact_number, gst_number, address

const supplierSchema = new Schema({
  company_name: { type: String },
  contact_person: { type: String },
  contact_number: { type: String },
  gst_number: { type: String },
  address: { type: String }
});

const Supplier = mongoose.model("Supplier", supplierSchema);

module.exports = Supplier;
