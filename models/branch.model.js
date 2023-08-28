const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const branchSchema = new Schema({
  name: { type: String },
  address: { type: String },
  phoneNo: { type: String },
  dop: { type: String },
});

const Branch = mongoose.model("Branch", branchSchema);

module.exports = Branch;
