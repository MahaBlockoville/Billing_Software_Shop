const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const saleSchema = new Schema({
        //  name, imei_number, phone, address, email, selling_value, 
         // tenure, branch, payment_type, dos
  name: { type: String },
  imei_number: { type: String },
  category: { type: String },
  inward: { type: Object },
  phone: { type: String },
  address: { type: String },
  email: { type: String },
  branch: { type: String },
  selling_value: { type: String },
  payment_type: { type: String },
  tenure: { type: String },
  dos: { type: String },
  sales_person: { type: String },
  finance_name: { type: String },
  order_no: { type: String },
  type: { type: String , default: 'wgst'},
  shipping_name: { type: String },
  shipping_phone: { type: String },
  shipping_address: { type: String },
  shipping_email: { type: String },
  gst_number: { type: String },
  gst_percentage: { type: String },
});

const Sale = mongoose.model("Sale", saleSchema);

module.exports = Sale;
