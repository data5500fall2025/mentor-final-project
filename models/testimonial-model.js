const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    role: {
      type: String,
      required: [true, "Role is required"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
    },
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Testimonial", testimonialSchema, "testimonials");
