const mongoose = require("mongoose");

const customerSchema = mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, "please enter the customer name"],
    },
    customerNumber: {
      type: String,
      required: [true, "please enter the customer quantity"],
    },
    customerEmail: {
      type: String,
      required: [true, "please enter the customer email"],
    },
    bookedFor: {
      type: String,
      required: [true, "please enter the Booked For"],
    },
    docketNumber: {
      type: String,
      required: [true, "please enter the Docket Number"],
    },
    dropOffDate: {
      type: String,
      required: [true, "please enter the Drop Off Date"],
    },
    dropCity: {
      type: String,
      required: [true, "please enter the Drop City"],
    },
    dropAddress: {
      type: String,
      required: [true, "please enter the drop address"],
    },
    dropContactNumber: {
      type: String,
      required: [true, "please enter the Drop Contact Number"],
    },
    dropBagSizes: {
      type: String,
      required: [true, "please enter the Drop Bag Sizes"],
    },
    modeOfTransport: {
      type: String,
      required: [true, "please enter the Mode Of Transport"],
    },
    bookingAmount: {
      type: String,
      required: [true, "please enter the Booking Amount"],
    },
  },
  { timestamps: true }
);

const customerDetail = mongoose.model("customerDetail", customerSchema);
module.exports = customerDetail;
