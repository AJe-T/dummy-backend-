// models/image.model.js
const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: [true, "Please enter the customer name"],
  },
  customerNumber: {
    type: String,
    required: [true, "Please enter the customer number"],
  },
  docketNumber: {
    type: String,
    required: [true, "Please enter the docket number"],
  },
  image: {
    type: Buffer,
    required: [true, "Please upload an image"],
  },
});

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;
