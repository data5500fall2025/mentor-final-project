const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    subject: {
      type: String,
      required: false
    },
    phone: {
      type: String,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
    },
    response: {
      type: String,
      default: "",
    },
    responseDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema, "contacts");
