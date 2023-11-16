const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const saleSchema = new Schema({
        //  name, imei_number, phone, address, email, selling_value, 
         // tenure, branch, payment_type, dos
  name: { type: String },
  product_list: { type: Array },
  invoice_id: { type: String },
  phone: { type: String },
  address: { type: String },
  email: { type: String },
  inward: {type: Object },
  gst_number: {type: String },
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
});

const Sale = mongoose.model("Sale", saleSchema);

module.exports = Sale;
