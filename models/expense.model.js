const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const branchSchema = new Schema({
    brand: { type: String },
  expense: { type: String },
  content: { type: String },
  amount: { type: String },
  doe: { type: String },
});

const Expense = mongoose.model("Expense", branchSchema);

module.exports = Expense;
