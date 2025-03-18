const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema({
  sc_id: String,
  sc_name: String,
  sc_price_perkg: String,
  sc_transit_days: String,
  service_type: String,
});

module.exports = mongoose.model("Country", countrySchema);